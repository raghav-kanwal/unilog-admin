import { Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Input, useDisclosure } from "@chakra-ui/react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Fragment, useRef, useState } from "react"

export default function Table() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [shipmentDetailIndex, setShipmentDetailIndex] = useState<number>(0);

    const showShipmentDetails = (index: number) => {
        setShipmentDetailIndex(index);
        onOpen();
    }

    const data = Array(1000).fill([
        'AWB: 3108518186, Courier: ECOM',
        '4695400513715',
        'Raghav, 8171505570',
        'SP-BHI-FY23-175840',
        'ARIHANT',
        'Delivered',
        'Jan. 6, 2023, 3:24 p.m.',
        'Jan. 8, 2023, 9:52 p.m.',
        'Jan. 13, 2023, 6 p.m.',
        'Jan. 11, 2023, 1:12 p.m.',
        '2',
    ]);

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
        count: data.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 65,
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
                    height: `500px`,
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
                                        height: `65px`,
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
                                                ? data[virtualRow.index][virtualColumn.index]
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