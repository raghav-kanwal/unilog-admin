import { fetchShipmentList } from "apis/post";
import { Duration } from "enums";
import { useQuery } from "@tanstack/react-query"
import { createColumnHelper, useReactTable, getCoreRowModel, flexRender, ColumnHelper, ColumnDef } from "@tanstack/react-table"
import { mapData, ShipmentListColumns as ShipmentDetailsColumns } from "./utils"
import { Button, Center, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Flex, Text, useDisclosure } from "@chakra-ui/react";
import ShipmentDetails from "../ShipmentDetails/ShipmentDetails";
import { useMemo, useState } from "react";
import { Spinner } from "react-bootstrap";

interface Props {
    searchText: string;
    duration: Duration;
    from: string;
    to: string;
}

export default function ShipmentList({ searchText, duration, from, to }: Props) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [trackingNumber, setTrackingNumber] = useState<string | null>(null);

    const { isLoading, isError, fetchStatus, data } = useQuery({
        queryKey: ['fetchShipmentList'],
        queryFn: () => fetchShipmentList(searchText, from, to),
        refetchOnWindowFocus: false,
    });

    const showShipmentDetails = (row: any) => {
        setTrackingNumber(row.getAllCells().find((cell: any) => cell.column.id === 'shippingProvider').getValue().awb || null);
        onOpen();
    }

    const hideShipmentDetails = () => {
        setTrackingNumber(null);
        onClose();
    }

    const columnHelper = createColumnHelper<ShipmentDetailsColumns>();
    const columns = useMemo(() => createColumns(columnHelper, showShipmentDetails), []);

    const table = useReactTable({
        data: useMemo(() => mapData(data), [data]),
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    if (isLoading || fetchStatus === 'fetching') return <Center h="400px"><Spinner /></Center>
    if (isError) return <Center h="400px">An error occurred, please try again later!</Center>

    return (
        <>
            <div>
                <table>
                    <thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map((row) => (
                            <tr key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <td key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        {table.getFooterGroups().map((footerGroup) => (
                            <tr key={footerGroup.id}>
                                {footerGroup.headers.map((header) => (
                                    <th key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.footer,
                                                header.getContext()
                                            )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </tfoot>
                </table>
            </div>
            <Drawer
                isOpen={isOpen}
                placement='right'
                onClose={hideShipmentDetails}
                size='xl'
            >
                <DrawerOverlay transform="none !important" />
                <DrawerContent transform="none !important">
                    <DrawerCloseButton />
                    <DrawerHeader py={2}>Shipment Details</DrawerHeader>

                    <DrawerBody>
                        {trackingNumber ? <ShipmentDetails trackingNumber={trackingNumber} /> : <Center h="100%"><Spinner /></Center>}
                    </DrawerBody>

                    <DrawerFooter justifyContent="flex-start" borderTop="1px solid var(--chakra-colors-gray-200)">
                        <Flex justify="flex-start">
                            <Button variant='outline' onClick={hideShipmentDetails} size="sm" h={`28px`}>
                                Close
                            </Button>
                        </Flex>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    )
}

function createColumns(columnHelper: ColumnHelper<ShipmentDetailsColumns>, callback: Function): ColumnDef<ShipmentDetailsColumns, any>[] {
    return [
        columnHelper.accessor('shippingProvider', {
            cell: (info) => {
                return (
                    <>
                        <Text>AWB: {info.getValue().awb}</Text>
                        <Text>Courier: {info.getValue().courier}</Text>
                    </>
                )
            },
            header: 'Shipping Provider',
        }),
        columnHelper.accessor('saleOrder', {
            cell: (info) => info.getValue(),
            header: 'Sale Order',
        }),
        columnHelper.accessor('customer', {
            cell: (info) => {
                return (
                    <>
                        <Text>{info.getValue().name}</Text>
                        <Text>{info.getValue().phone}</Text>
                    </>
                )
            },
            header: 'Customer',
        }),
        columnHelper.accessor('shippingPackage', {
            cell: (info) => info.getValue(),
            header: 'Shipping Package',
        }),
        columnHelper.accessor('facility', {
            cell: (info) => info.getValue(),
            header: 'Facility',
        }),
        columnHelper.accessor('trackingStatus', {
            cell: (info) => info.getValue(),
            header: 'Tracking Status',
        }),
        columnHelper.accessor('orderDate', {
            cell: (info) => info.getValue(),
            header: 'Order Date',
        }),
        columnHelper.accessor('dispatchDate', {
            cell: (info) => info.getValue(),
            header: 'Dispatch Date',
        }),
        columnHelper.accessor('expectedDeliveryDate', {
            cell: (info) => info.getValue(),
            header: 'Expected Delivery Date',
        }),
        columnHelper.accessor('deliveryDate', {
            cell: (info) => info.getValue(),
            header: 'Delivery Date',
        }),
        columnHelper.accessor('attempts', {
            cell: (info) => info.getValue(),
            header: 'No. of Attempts',
        }),
        columnHelper.display({
            id: "actions",
            cell: (info) => <Button size='xs' onClick={() => callback(info.row)}>Show</Button>
        })
    ]
}