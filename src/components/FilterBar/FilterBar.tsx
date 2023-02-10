import { Flex, Input, Button, Text, Menu, MenuButton, MenuList, MenuItem, Box, Select, Checkbox } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { fetchMetaData } from "apis/get";
import { Duration } from "enums";
import { Filters } from "interfaces";
import { FaChevronDown } from "react-icons/fa";
import { useEffect, useState } from "react";
import { AiFillCaretDown } from "react-icons/ai";
import { resolveDuration } from "utils";
import DownloadCSV from "../DownloadCSV/DownloadCSV";

interface Props {
    filters: Filters;
    setFilters: Function;
}

export default function FilterBar({ filters, setFilters }: Props) {
    const { from, to } = resolveDuration(Duration.LAST_WEEK, '', '');

    const [toDate, setToDate] = useState<string>(to);
    const [fromDate, setFromDate] = useState<string>(from);
    const [duration, setDuration] = useState<Duration>(Duration.LAST_WEEK);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [sortBy, setSortBy] = useState<string | null>(null);
    const [filterBy, setFilterBy] = useState<string[]>([]);

    const { data } = useQuery({
        queryKey: ['fetchMetaData'],
        queryFn: fetchMetaData,
        refetchOnWindowFocus: false,
        staleTime: Infinity,
    });

    useEffect(() => {
        setFilters({
            searchText: searchQuery,
            from: fromDate,
            to: toDate,
            sortBy: sortBy,
            filterBy: filterBy,
        })
    }, [])

    useEffect(() => {
        const { from, to } = resolveDuration(duration, fromDate, toDate);
        setFromDate(from);
        setToDate(to);
    }, [duration])

    const onSearch = () => {
        setFilters({
            searchText: searchQuery,
            from: fromDate,
            to: toDate,
            sortBy: sortBy,
            filterBy: filterBy,
        })
    }

    const onCheckboxChange = (ev: any, key: string) => {
        if (ev.target.checked) setFilterBy((filters) => [...filters, key]);
        else setFilterBy((filters) => filters.filter(f => f !== key));
    }

    return (
        <Flex justifyContent="space-between" align="center">
            <Input value={searchQuery} placeholder="Search AWB/Order/Phone/Facility/Courier" w={`25%`} bg={`#fff`} onChange={(e) => setSearchQuery(e.target.value)} />
            <Flex gap={4}>

                <Flex align="center">
                    <Select onChange={(ev) => setSortBy(ev.target.value)} placeholder='Sort By' background="white" icon={<AiFillCaretDown fontSize="14px" />} size="sm">
                        {
                            data?.result?.tracking_page?.sort_by ?
                                data.result.tracking_page.sort_by.map((
                                    { key, display }: { key: string, display: string }) => <option key={key} value={key}>{display}</option>
                                )
                                : <></>
                        }
                    </Select>
                </Flex>

                <Flex align="center">
                    <Menu autoSelect={false} closeOnSelect={false}>
                        <MenuButton as={Button} rightIcon={<AiFillCaretDown />} background="white" h={`2rem`} p={2} fontSize="sm">
                            <Text fontWeight="normal">Filter By</Text>
                        </MenuButton>
                        <MenuList>
                            {
                                data?.result?.tracking_page?.filters ?
                                    data.result.tracking_page.filters.map((
                                        { key, display }: { key: string, display: string }) =>
                                        <MenuItem key={key}>
                                            <Checkbox onChange={($event) => onCheckboxChange($event, key)}>{display}</Checkbox>
                                        </MenuItem>
                                    )
                                    : <></>
                            }
                        </MenuList>
                    </Menu>
                </Flex>

                <Flex justifyContent="flex-end" align={`center`}>
                    <Text as="span" mr={2}>Timeline: </Text>
                    <Menu autoSelect={false}>
                        <MenuButton as={Button} bg={`white`} rightIcon={<AiFillCaretDown />} w="8.5rem" h={`2rem`} p={2} fontSize="sm">
                            <Text fontWeight="normal">{duration}</Text>
                        </MenuButton>
                        <MenuList>
                            {Object.keys(Duration).map((key, index) => (
                                <MenuItem key={index} onClick={() => setDuration(Duration[key as keyof typeof Duration])}>
                                    {Duration[key as keyof typeof Duration]}
                                </MenuItem>
                            ))}
                        </MenuList>
                    </Menu>
                    {
                        duration === Duration.CUSTOM
                            ? (
                                <>
                                    <Box ml={2}>
                                        <Text as="span" mr={2}>From: </Text>
                                        <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} w="10rem" background="white" />
                                    </Box>
                                    <Box ml={2}>
                                        <Text as="span" mr={2}>To: </Text>
                                        <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} w="10rem" background="white" />
                                    </Box>
                                </>
                            )
                            : null
                    }
                </Flex>
                <DownloadCSV filters={filters} />
                <Button colorScheme="teal" size="sm" onClick={onSearch}>Search</Button>
            </Flex>
        </Flex>
    )
}