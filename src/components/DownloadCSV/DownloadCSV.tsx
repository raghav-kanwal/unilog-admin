import { IconButton, Tooltip, useToast } from "@chakra-ui/react";
import { TbDownload } from 'react-icons/tb';
import * as PapaParse from 'papaparse';
import { Filters } from "interfaces";
import { fetchShipmentList } from "apis/post";

interface Props {
    filters: Filters
}

export default function DownloadCSV({ filters: { searchText, from, to } }: Props) {
    const toast = useToast();

    const handleCSVDownload = async () => {
        try {
            const data = await fetchShipmentList(searchText, from, to);
            const csv = PapaParse.unparse(data.result.tracking_records);
            const blob = new Blob([csv], { type: "text/csv" });
            const a = document.createElement("a");
            a.download = `Tracking_${new Date().toLocaleDateString('en-IN').split('/').join('')}_${new Date(from).toLocaleDateString('en-IN').split('/').join('')}_${new Date(to).toLocaleDateString('en-IN').split('/').join('')}`;
            a.href = window.URL.createObjectURL(blob)
            const clickEvt = new MouseEvent('click', {
                view: window,
                bubbles: true,
                cancelable: true,
            })
            a.dispatchEvent(clickEvt);
            a.remove();
        } catch (err: any) {
            toast({
                status: 'error',
                title: err.message,
                variant: 'left-accent',
                position: 'top-right',
                duration: 4000,
                isClosable: true,
            });
        }
    }

    return (
        <>
            <Tooltip hasArrow label="Download as CSV">
                <IconButton size="sm" colorScheme="teal" icon={<TbDownload />} aria-label={'download'} onClick={() => handleCSVDownload()}></IconButton>
            </Tooltip>
        </>
    )
}