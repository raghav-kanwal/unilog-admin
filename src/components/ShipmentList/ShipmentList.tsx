import { fetchShipmentList } from "apis/post";
import { useQuery } from "@tanstack/react-query"
import { createColumnHelper, useReactTable, getCoreRowModel, flexRender, ColumnHelper, ColumnDef } from "@tanstack/react-table"
import { mapData, ShipmentListColumns } from "./utils"
import { Button, Center, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Flex, Text, useDisclosure } from "@chakra-ui/react";
import ShipmentDetails from "../ShipmentDetails/ShipmentDetails";
import { useMemo, useState } from "react";
import { Spinner } from "react-bootstrap";
import { Filters } from "src/shared/interfaces";
import styles from './ShipmentList.module.scss';

interface Props {
    filters: Filters
}

export default function ShipmentList({ filters }: Props) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [trackingNumber, setTrackingNumber] = useState<string | null>(null);

    const { isLoading, isError, isFetching, data, error } = useQuery({
        queryKey: ['fetchShipmentList', filters],
        queryFn: () => fetchShipmentList(filters.searchText, filters.from, filters.to, filters.sortBy, filters.filterBy, filters.customFieldValues),
        refetchOnWindowFocus: false,
        refetchInterval: (data, query) => (query.state.dataUpdateCount === 1 && data?.result?.refresh_required) ? 100 : false,
        enabled: !!filters.from?.length && !!filters.to?.length,
    });

    const showShipmentDetails = (row: any) => {
        setTrackingNumber(row.getAllCells().find((cell: any) => cell.column.id === 'shippingProvider').getValue().awb || null);
        onOpen();
    }

    const hideShipmentDetails = () => {
        setTrackingNumber(null);
        onClose();
    }

    const columnHelper = createColumnHelper<ShipmentListColumns>();
    const columns = useMemo(() => createColumns(columnHelper, showShipmentDetails), []);

    const table = useReactTable({
        data: useMemo(() => mapData(data), [data]),
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    if (isLoading || isFetching) return <Center h="400px"><Spinner /></Center>
    if (isError) return <Center h="400px">{String(error) ?? 'An error occurred, please try again later!'}</Center>

    return (
        <>
            <div className={styles.shipmentListContainer}>
                <table className={styles.shipmentListTable}>
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
                    <DrawerHeader py={2} px={4} bg={`gray.100`}>Shipment Details</DrawerHeader>

                    <DrawerBody>
                        {trackingNumber ? <ShipmentDetails trackingNumber={trackingNumber} /> : <Center h="100%"><Spinner /></Center>}
                    </DrawerBody>

                    <DrawerFooter justifyContent="flex-start" borderTop="1px solid var(--chakra-colors-gray-200)" py={2} px={4} bg={`gray.100`}>
                        <Flex justify="flex-start">
                            <Button bg={`white`} variant='outline' onClick={hideShipmentDetails} size="sm" h={`28px`}>
                                Close
                            </Button>
                        </Flex>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    )
}

function createColumns(columnHelper: ColumnHelper<ShipmentListColumns>, callback: Function): ColumnDef<ShipmentListColumns, any>[] {
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
        columnHelper.accessor('orderDetails', {
            cell: (info) => {
                return (
                    <>
                        <Text>SO: {info.getValue().saleOrder}</Text>
                        <Text>SP: {info.getValue().shippingPackage}</Text>
                    </>
                )
            },
            header: 'Order Details'
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
        columnHelper.accessor('facility', {
            cell: (info) => info.getValue(),
            header: 'Facility',
        }),
        columnHelper.accessor('courierStatus', {
            cell: (info) => info.getValue(),
            header: 'Courier Status'
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
            cell: (info) => <Text as="p" textAlign="right">{info.getValue()}</Text>,
            header: (info) => 'No. of Attempts',
        }),
        columnHelper.display({
            id: "actions",
            cell: (info) => <Button size='xs' onClick={() => callback(info.row)}>Show</Button>
        })
    ]
}