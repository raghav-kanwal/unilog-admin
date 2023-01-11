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
        '3108518186',
        'ECOM',
        '4695400513715',
        'SP-BHI-FY23-175840',
        'ARIHANT',
        'Delivered',
        'Jan. 6, 2023, 3:24 p.m.',
        'Jan. 8, 2023, 9:52 p.m.',
        'Jan. 13, 2023, 6 p.m.',
        'Jan. 11, 2023, 1:12 p.m.',
        '2'
    ]);

    const columns = [
        'AWB',
        'Courier',
        'Sale Order',
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
        estimateSize: () => 80,
        overscan: 5,
    })

    const columnVirtualizer = useVirtualizer({
        horizontal: true,
        count: 12,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 120,
        overscan: 5,
    })


    return (
        <>
            <div
                ref={parentRef}
                className="List"
                style={{
                    height: `700px`,
                    width: `100%`,
                    overflow: 'auto',
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
                                        width: `120px`,
                                        height: `80px`,
                                        fontWeight: virtualRow.index === 0 ? 'bold' : 'normal',
                                        transform: `translateX(${virtualColumn.start + virtualColumn.index * 20}px) translateY(${virtualRow.start}px)`,
                                    }}
                                >
                                    {
                                        virtualRow.index === 0
                                            ? columns[virtualColumn.index]
                                            : virtualColumn.index !== 11
                                                ? data[virtualRow.index][virtualColumn.index]
                                                : <Button onClick={() => showShipmentDetails(virtualRow.index)}>Show</Button>
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
                size='full'
            >
                <DrawerOverlay />
                <DrawerContent>
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