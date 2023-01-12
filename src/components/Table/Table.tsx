import { Text, Center, Spinner, Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Input, useDisclosure, Box, Flex, Divider, Table, Td, Tr, TableCaption, TableContainer, Tbody, Th, Thead } from "@chakra-ui/react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Fragment, useEffect, useRef, useState, useCallback } from "react"
import debounce from 'lodash.debounce';

interface SearchQueryProps {
    searchQuery: string
}

export default function TableComponent({ searchQuery }: SearchQueryProps) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [shippingList, setShippingList] = useState<any[]>([]);
    const [shipmentDetails, setShipmentDetails] = useState<any>()
    const [shipmentDetailIndex, setShipmentDetailIndex] = useState<number>(-1);

    const handler = useCallback(debounce((searchQuery) => fetchShipmentList(searchQuery), 200), []);

    useEffect(() => {
        setShippingList([]);
        handler(searchQuery);
    }, [searchQuery])

    useEffect(() => {
        async function fetchShipmentDetails() {
            try {
                const trackingId = shippingList[shipmentDetailIndex][shippingList[shipmentDetailIndex].length - 1];
                const res = await fetch(`https://qa-unishipper.unicommerce.com/shipper/api/tracking-details?tr_number=${trackingId}`, {
                    method: "GET",
                    headers: {
                        'APP-KEY': '#$%^SK&SNLSH*^%SF'
                    }
                })

                if (!res.ok) throw new Error(res.statusText);

                const data = await res.json();
                setShipmentDetails(data.result.tracking_details);
            } catch (err) {
                console.log(err)
            }
        }

        if (shipmentDetailIndex != -1) fetchShipmentDetails();
    }, [shipmentDetailIndex])

    async function fetchShipmentList(searchQuery: string) {
        try {
            const res = await fetch("https://qa-unishipper.unicommerce.com/shipper/api/tracking-list", {
                method: "POST",
                headers: {
                    'APP-KEY': '#$%^SK&SNLSH*^%SF'
                },
                body: JSON.stringify({ "search_text": searchQuery })
            });

            if (!res.ok) throw new Error(res.statusText);

            const data = await res.json();
            setShippingList(data.result.tracking_records.map((row: any) => {
                return [
                    <Box>
                        <Text>AWB: {row.tracking_number}</Text>
                        <Text>Courier: {row.shipping_source_code}</Text>
                    </Box>,
                    `${row.order_number}`,
                    <Box>
                        <Text>{row.customer_name}</Text>
                        <Text>{row.customer_phone}</Text>
                    </Box>,
                    `${row.shipping_package_code}`,
                    `${row.facility_code}`,
                    `${row.current_wismo_display_status}`,
                    <Text>{parseDate(row.order_datetime)}</Text>,
                    <Text>{parseDate(row.dispatch_datetime)}</Text>,
                    <Text>{parseDate(row.expected_delivered_datetime)}</Text>,
                    <Text>{parseDate(row.delivered_datetime)}</Text>,
                    `${row.no_of_items}`,
                    `${row.tracking_number}`
                ]
            }))
        } catch (err) {
            console.log(err);
        }
    }

    const showShipmentDetails = (index: number) => {
        setShipmentDetailIndex(index);
        onOpen();
    }

    const handleOnClose = () => {
        setShipmentDetailIndex(-1);
        setShipmentDetails(null)
        onClose();
    }

    const parseDate = (oldDate: string): string => !oldDate ? "-" : (new Date(oldDate).toLocaleDateString("en-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    }));

    const columns = [
        { name: 'Shipping Provider', width: 150 },
        { name: 'Sale Order', width: 120 },
        { name: 'Customer', width: 135 },
        { name: 'Shipping Package', width: 110 },
        { name: 'Facility', width: 90 },
        { name: 'Tracking Status', width: 110 },
        { name: 'Order Date', width: 110 },
        { name: 'Dispatch Date', width: 110 },
        { name: 'Expected Delivery Date', width: 110 },
        { name: 'Delivery Date', width: 110 },
        { name: 'No of Attempts', width: 85 },
        { name: 'Action', width: 80 },
    ];

    const parentRef = useRef(null)

    const rowVirtualizer = useVirtualizer({
        count: shippingList.length + 1,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 80,
        overscan: 5,
    });

    const columnVirtualizer = useVirtualizer({
        horizontal: true,
        count: 12,
        getScrollElement: () => parentRef.current,
        estimateSize: (i) => columns[i]['width'],
        overscan: 5,
    })


    return (
        <>
            <div
                ref={parentRef}
                className="List"
                style={{
                    height: `520px`,
                    width: `100%`,
                    overflow: 'auto'
                }}
            >
                <div
                    style={{
                        height: `${rowVirtualizer.getTotalSize()}px`,
                        width: `${columnVirtualizer.getTotalSize()}px`,
                        position: 'relative',
                    }}
                >
                    {rowVirtualizer.getVirtualItems().length < 2 ? <Center h={`520px`}><Spinner /></Center> : ""}
                    {rowVirtualizer.getVirtualItems().map((virtualRow) => (
                        <Fragment key={virtualRow.index}>
                            {columnVirtualizer.getVirtualItems().map((virtualColumn) => (
                                <div
                                    key={virtualColumn.index}
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: columns[virtualColumn.index]['width'],
                                        height: `80px`,
                                        padding: `0.5rem`,
                                        fontWeight: virtualRow.index === 0 ? 'bold' : 'normal',
                                        borderBottom: `1px solid #ececec`,
                                        borderRight: virtualColumn.index !== 11 ? `1px solid #ececec` : 0,
                                        fontSize: virtualRow.index === 0 ? '0.875rem' : '0.75rem',
                                        // width: virtualColumn.index === 10 ? '50px' : '110px',
                                        textAlign: virtualColumn.index === 10 ? 'right' : 'left',
                                        transform: `translateX(${virtualColumn.start}px) translateY(${virtualRow.start}px)`,
                                    }}
                                >
                                    {
                                        virtualRow.index === 0
                                            ? columns[virtualColumn.index]['name']
                                            : virtualColumn.index !== 11
                                                ? shippingList[virtualRow.index - 1][virtualColumn.index]
                                                : <Button fontSize="xs" p={2} py={2} h={`28px`} onClick={() => showShipmentDetails(virtualRow.index - 1)}>Show</Button>
                                    }
                                </div>
                            ))}
                        </Fragment>
                    ))}
                </div>
            </div>

            <Drawer
                isOpen={isOpen}
                placement='right'
                onClose={handleOnClose}
                size='xl'
            >
                <DrawerOverlay transform="none !important"/>
                <DrawerContent transform="none !important">
                    <DrawerCloseButton />
                    <DrawerHeader py={2}>Shipment Details</DrawerHeader>

                    <DrawerBody>
                        {!shipmentDetails && <Center h={`100%`}><Spinner/></Center>}
                        {shipmentDetails && <>
                            <Text fontSize="md" mb={4}>Basic Information</Text>
                            <Flex justifyContent="space-between" mb={3}>
                                <Box className="container" w={`25%`} p={0}>
                                    <Text className="key" fontSize="xs" color="gray.600">
                                        Tracking Number
                                    </Text>
                                    <Text className="value" fontSize="sm">
                                        {shipmentDetails.tracking_number || "-"}
                                    </Text>
                                </Box>
                                <Box className="container" w={`25%`} p={0}>
                                    <Text className="key" fontSize="xs" color="gray.600">
                                        Sale Order
                                    </Text>
                                    <Text className="value" fontSize="sm">
                                        {shipmentDetails.order_number || "-"}
                                    </Text>
                                </Box>
                                <Box className="container" w={`25%`} p={0}>
                                    <Text className="key" fontSize="xs" color="gray.600">
                                        Shipping Package
                                    </Text>
                                    <Text className="value" fontSize="sm">
                                        {shipmentDetails.shipping_package_code || "-"}
                                    </Text>
                                </Box>
                                <Box className="container" w={`25%`} p={0}>
                                    <Text className="key" fontSize="xs" color="gray.600">
                                        Tracking Status
                                    </Text>
                                    <Text className="value" fontSize="sm">
                                        {shipmentDetails.current_wismo_display_status || "-"}
                                    </Text>
                                </Box>
                            </Flex>

                            <Flex justifyContent="space-between" mb={3}>
                                <Box className="container" w={`25%`} p={0}>
                                    <Text className="key" fontSize="xs" color="gray.600">
                                    Courier
                                    </Text>
                                    <Text className="value" fontSize="sm">
                                        {shipmentDetails.shipping_source_code || "-"}
                                    </Text>
                                </Box>
                                <Box className="container" w={`25%`} p={0}>
                                    <Text className="key" fontSize="xs" color="gray.600">
                                    Shipping Method Type
                                    </Text>
                                    <Text className="value" fontSize="sm">
                                        {shipmentDetails.shipping_type || "-"}
                                    </Text>
                                </Box>
                                <Box className="container" w={`25%`} p={0}>
                                    <Text className="key" fontSize="xs" color="gray.600">
                                    Payment Method
                                    </Text>
                                    <Text className="value" fontSize="sm">
                                        {shipmentDetails.payment_method || "-"}
                                    </Text>
                                </Box>
                                <Box className="container" w={`25%`} p={0}>
                                    <Text className="key" fontSize="xs" color="gray.600">
                                    Number of Items
                                    </Text>
                                    <Text className="value" fontSize="sm">
                                        {shipmentDetails.no_of_items || "-"}
                                    </Text>
                                </Box>
                            </Flex>

                            <Flex justifyContent="space-between" mb={3}>
                                <Box className="container" w={`25%`} p={0}>
                                    <Text className="key" fontSize="xs" color="gray.600">
                                    Date of Order
                                    </Text>
                                    <Text className="value" fontSize="sm">
                                    {parseDate(shipmentDetails.order_datetime) || "-"}
                                    </Text>
                                </Box>
                                <Box className="container" w={`25%`} p={0}>
                                    <Text className="key" fontSize="xs" color="gray.600">
                                    Date of Dispatch
                                    </Text>
                                    <Text className="value" fontSize="sm">
                                    {parseDate(shipmentDetails.dispatch_datetime) || "-"}
                                    </Text>
                                </Box>
                                <Box className="container" w={`25%`} p={0}>
                                    <Text className="key" fontSize="xs" color="gray.600">
                                    Date of Expected Delivery
                                    </Text>
                                    <Text className="value" fontSize="sm">
                                    {parseDate(shipmentDetails.expected_delivered_datetime) || "-"}
                                    </Text>
                                </Box>
                                <Box className="container" w={`25%`} p={0}>
                                    <Text className="key" fontSize="xs" color="gray.600">
                                    Date of Delivery
                                    </Text>
                                    <Text className="value" fontSize="sm">
                                    {parseDate(shipmentDetails.delivered_datetime) || "-"}
                                    </Text>
                                </Box>
                            </Flex>

                            <Flex justifyContent="space-between" mb={3}>
                                <Box className="container" w={`25%`} p={0}>
                                    <Text className="key" fontSize="xs" color="gray.600">
                                    Shipment Total Cost
                                    </Text>
                                    <Text className="value" fontSize="sm">
                                    {parseDate(shipmentDetails.total_price) || "-"}
                                    </Text>
                                </Box>
                                <Box className="container" w={`25%`} p={0}>
                                    <Text className="key" fontSize="xs" color="gray.600">
                                    Customer Name
                                    </Text>
                                    <Text className="value" fontSize="sm">
                                    {shipmentDetails.customer_name || "-"}
                                    </Text>
                                </Box>
                                <Box className="container" w={`25%`} p={0}>
                                    <Text className="key" fontSize="xs" color="gray.600">
                                    Customer Phone
                                    </Text>
                                    <Text className="value" fontSize="sm">
                                    {shipmentDetails.customer_phone || "-"}
                                    </Text>
                                </Box>
                                <Box className="container" w={`25%`} p={0}>
                                    <Text className="key" fontSize="xs" color="gray.600">
                                    Customer Email
                                    </Text>
                                    <Text className="value" fontSize="sm">
                                    {shipmentDetails.customer_email || "-"}
                                    </Text>
                                </Box>
                            </Flex>
                            <Flex justifyContent={`flex-start`} mb={4}>
                            <Box className="container" w={`100%`} p={0}>
                                    <Text className="key" fontSize="xs" color="gray.600">
                                    Customer Address
                                    </Text>
                                    <Text className="value" fontSize="sm">
                                    {shipmentDetails.delivery_address || "-"}
                                    </Text>
                                </Box>
                            </Flex>
                            <Divider mb={4}/>
                            <Text fontSize="md" mb={4}>Order Items </Text>
                            <TableContainer>
                                <Table variant='simple' border={`1px solid var(--chakra-colors-gray-200)`}>
                                    <Thead>
                                    <Tr>
                                        <Th textTransform={`initial`} fontSize="xs" fontWeight="normal" px={2} py={2}>SKU</Th>
                                        <Th textTransform={`initial`} fontSize="xs" fontWeight="normal" px={2} py={2} borderLeft="1px solid var(--chakra-colors-gray-200)">Channel Product</Th>
                                        <Th textTransform={`initial`} fontSize="xs" fontWeight="normal" px={2} py={2} borderLeft="1px solid var(--chakra-colors-gray-200)">Total Cost</Th>
                                    </Tr>
                                    </Thead>
                                    <Tbody>
                                    {
                                        shipmentDetails && shipmentDetails.line_items && shipmentDetails.line_items.map((item: any, idx: number) => { return <Tr key={idx}>
                                                <Td px={2} py={2} fontSize="sm">{item.seller_sku_code}</Td>
                                                <Td px={2} py={2} fontSize="sm" borderLeft="1px solid var(--chakra-colors-gray-200)">{item.seller_sku_code}</Td>
                                                <Td px={2} py={2} fontSize="sm" borderLeft="1px solid var(--chakra-colors-gray-200)">{item.total_price}</Td>
                                            </Tr>
                                        })
                                    }
                                    </Tbody>
                                </Table>
                            </TableContainer>
                            
                            <Divider my={4}/>

                            <Text fontSize="md" mb={4}>Tracking Events</Text>
                            {/* {shipmentDetails && shipmentDetails.tracking_events && shipmentDetails.tracking_events.map((item: any, idx: number) => {
                                <Box key={idx}>
                                    <Text>: {item.tracking_datetime}</Text>
                                    <Text>: {item.tracking_status}</Text>
                                    <Text>: {item.tracking_location || "-"}</Text>
                                </Box>
                            }) */}
                            <TableContainer>
                                <Table variant='simple' border={`1px solid var(--chakra-colors-gray-200)`} mb={2}>
                                    <Thead>
                                    <Tr>
                                        <Th textTransform={`initial`} fontSize="xs" fontWeight="normal" px={2} py={2}>Date</Th>
                                        <Th textTransform={`initial`} fontSize="xs" fontWeight="normal" px={2} py={2} borderLeft="1px solid var(--chakra-colors-gray-200)">Status</Th>
                                        <Th textTransform={`initial`} fontSize="xs" fontWeight="normal" px={2} py={2} borderLeft="1px solid var(--chakra-colors-gray-200)">Location</Th>
                                    </Tr>
                                    </Thead>
                                    <Tbody>
                                    {
                                        shipmentDetails && shipmentDetails.tracking_events && shipmentDetails.tracking_events.map((item: any, idx: number) => { return <Tr key={idx}>
                                                <Td px={2} py={2} fontSize="sm">{item.tracking_datetime || "-"}</Td>
                                                <Td px={2} py={2} fontSize="sm" borderLeft="1px solid var(--chakra-colors-gray-200)">{item.tracking_status || "-"}</Td>
                                                <Td px={2} py={2} fontSize="sm" borderLeft="1px solid var(--chakra-colors-gray-200)">{item.tracking_location || "-"}</Td>
                                            </Tr>
                                        })
                                    }
                                    </Tbody>
                                </Table>
                            </TableContainer>
                        </>}
                    </DrawerBody>

                    <DrawerFooter justifyContent="flex-start" borderTop="1px solid var(--chakra-colors-gray-200)">
                        <Flex justify="flex-start">
                            <Button variant='outline' onClick={onClose} size="sm" h={`28px`}>
                                Close
                            </Button>
                        </Flex>
                        {/* <Button colorScheme='blue' size="sm" h={`28px`}>Close</Button> */}
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    )
}