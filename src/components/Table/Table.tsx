import { Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Input, useDisclosure } from "@chakra-ui/react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Fragment, useEffect, useRef, useState } from "react"

export default function Table() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [shippingList, setShippingList] = useState<any[]>([]);
    const [shipmentDetailIndex, setShipmentDetailIndex] = useState<number>(0);

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
                        `AWB: ${row.tracking_number}, Courier: ${row.shipping_source_code}`,
                        `${row.order_number}`,
                        `${row.customer_name}, ${row.customer_phone}`,
                        `${row.shipping_package_code}`,
                        `${row.facility_code}`,
                        `${row.current_wismo_display_status}`,
                        `${row.order_datetime}`,
                        `${row.dispatch_datetime}`,
                        `${row.expected_delivered_datetime}`,
                        `${row.delivered_datetime}`,
                        `${row.no_of_items}`,
                    ]
                }))
            } catch (err) {
                console.log(err);
            }
        }

        fetchShipmentList();
    }, [])

    const showShipmentDetails = (index: number) => {
        setShipmentDetailIndex(index);
        onOpen();
    }

    const columns = [
        'Shipping Provider',
        'Sale Order',
        'Customer',
        'Shipping Package',
        'Facility',
        'Tracking Status',
        'Order Date',
        'Dispatch Date',
        'Expected Delivery Date',
        'Delivery Date',
        'No of Attempts',
        'View Details',
    ];

    const parentRef = useRef(null)

    const rowVirtualizer = useVirtualizer({
        count: shippingList.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 80,
        overscan: 5,
    })

    const columnVirtualizer = useVirtualizer({
        horizontal: true,
        count: 12,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 110,
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
                                        width: `110px`,
                                        height: `80px`,
                                        padding: `0.5rem`,
                                        fontWeight: virtualRow.index === 0 ? 'bold' : 'normal',
                                        borderRight: `1px solid #ececec`,
                                        borderBottom: `1px solid #ececec`,
                                        fontSize: virtualRow.index === 0 ? '0.875rem' : '0.75rem',
                                        textAlign: virtualColumn.index === 10 ? 'right' : 'left',
                                        transform: `translateX(${virtualColumn.start}px) translateY(${virtualRow.start}px)`,
                                    }}
                                >
                                    {
                                        virtualRow.index === 0
                                            ? columns[virtualColumn.index]
                                            : virtualColumn.index !== 11
                                                ? shippingList[virtualRow.index][virtualColumn.index]
                                                : <Button fontSize="xs" p={2} py={2} h={`28px`} onClick={() => showShipmentDetails(virtualRow.index)}>Show</Button>
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
                        Shipment Details for index {shipmentDetailIndex}
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