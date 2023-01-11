import { Text, Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Input, useDisclosure, Box } from "@chakra-ui/react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Fragment, useEffect, useRef, useState } from "react"

export default function Table() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [shippingList, setShippingList] = useState<any[]>([]);
    const [shipmentDetails, setShipmentDetails] = useState<any>()
    const [shipmentDetailIndex, setShipmentDetailIndex] = useState<number>(-1);

    useEffect(() => {
        async function fetchShipmentList() {
            try {
                const res = await fetch("https://qa-unishipper.unicommerce.com/shipper/api/tracking-list", {
                    method: "POST",
                    headers: {
                        'APP-KEY': '#$%^SK&SNLSH*^%SF'
                    },
                    body: JSON.stringify({})
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

        fetchShipmentList();
    }, [])

    useEffect(() => {
        async function fetchShipmentDetails() {
            try {
                const res = await fetch(`https://qa-unishipper.unicommerce.com/shipper/api/tracking-details?tr_number=${shippingList[shipmentDetailIndex][shippingList[shipmentDetailIndex].length - 1]}`, {
                    method: "GET",
                    headers: {
                        'APP-KEY': '#$%^SK&SNLSH*^%SF'
                    }
                })

                if (!res.ok) throw new Error(res.statusText);

                const data = await res.json();
                setShipmentDetails(data.result);
            } catch (err) {
                console.log(err)
            }
        }

        if (shipmentDetailIndex != -1) fetchShipmentDetails();
    }, [shipmentDetailIndex])

    const showShipmentDetails = (index: number) => {
        setShipmentDetailIndex(index);
        onOpen();
    }

    const parseDate = (oldDate: string): string => (new Date(oldDate).toLocaleDateString("en-IN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        }));

    const columns = [
        { name: 'Shipping Provider', width: 140},
        { name: 'Sale Order', width: 120},
        { name: 'Customer', width: 130},
        { name: 'Shipping Package', width: 110},
        { name: 'Facility', width: 90},
        { name: 'Tracking Status', width: 110},
        { name: 'Order Date', width: 110},
        { name: 'Dispatch Date', width: 110},
        { name: 'Expected Delivery Date', width: 110},
        { name: 'Delivery Date', width: 110},
        { name: 'No of Attempts', width: 85},
        { name: 'Action', width: 80},
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
                    height: `535px`,
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
                                        borderRight: `1px solid #ececec`,
                                        borderBottom: `1px solid #ececec`,
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
                onClose={onClose}
                size='xl'
            >
                <DrawerOverlay />
                <DrawerContent transform="none !important">
                    <DrawerCloseButton />
                    <DrawerHeader>Shipment Details</DrawerHeader>

                    <DrawerBody>
                        <Text>{JSON.stringify(shipmentDetails)}</Text>
                    </DrawerBody>

                    <DrawerFooter>
                        <Button variant='outline' mr={3} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button colorScheme='blue'>Save</Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    )
}