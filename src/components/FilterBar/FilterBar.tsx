import { Flex, Input, Button, Menu, MenuButton, MenuList, MenuItem, Box, Select, Checkbox, useDisclosure, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Text, Tag } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { fetchMetaData } from "apis/get";
import { Duration } from "src/shared/enums";
import { Filters } from "src/shared/interfaces";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { AiFillCaretDown } from "react-icons/ai";
import DownloadCSV from "../DownloadCSV/DownloadCSV";
import { useDate, useDeviations } from "src/shared/hooks";
import styles from './filterBar.module.scss';

interface Props {
    filters: Filters;
    setFilters: Dispatch<SetStateAction<Filters>>;
}

export default function FilterBar({ filters, setFilters }: Props) {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [sortBy, setSortBy] = useState<string>("");
    const [filterBy, setFilterBy] = useState<string[]>([]);

    const [duration, setDuration] = useState<Duration>(Duration.LAST_WEEK);
    const { fromDate, toDate, setFromDate, setToDate } = useDate(duration);

    const deviations: number = useDeviations(sortBy, filterBy, duration);

    const { onOpen, isOpen, onClose } = useDisclosure();

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
        else setFilterBy((filters) => filters.filter(f => f !== key))
    }

    const handleOnCloseDrawer = () => {
        onClose();
        onSearch();
    }

    const clearFilters = () => {
        setSortBy('');
        setFilterBy([]);
        setDuration(Duration.LAST_WEEK);
        onSearch();
    }

    return (
        <>
            <Flex justifyContent="space-between" align="center">
                <Input value={searchQuery} placeholder="Search AWB/Order/Phone/Facility/Courier" w={`25%`} bg={`#fff`} onChange={(e) => setSearchQuery(e.target.value)} />
                <Flex gap={4}>
                    <Button colorScheme="teal" size="sm" onClick={onOpen}>
                        <Text as="span">Filter Records</Text>
                        { 
                            (deviations > 0) 
                                ? <Flex ml={1} w={4} h={4} bg="var(--chakra-colors-gray-100)" color="var(--chakra-colors-gray-800)" borderRadius={3} fontSize="x-small" align="center" justify="center">{deviations}</Flex> 
                                : <></> 
                        }
                    </Button>
                    { 
                        (deviations > 0) 
                            ? <Button colorScheme="teal" size="sm"><Text as="span" onClick={clearFilters}>Clear filters</Text></Button> 
                            : <></> 
                    }
                    <DownloadCSV filters={filters} />
                    <Button colorScheme="teal" size="sm" onClick={onSearch}>Search</Button>
                </Flex>
            </Flex>
            <Drawer isOpen={isOpen} onClose={onClose} placement='right' size='xl'>
                <DrawerOverlay transform="none !important" />
                <DrawerContent transform="none !important">
                    <DrawerCloseButton />
                    <DrawerHeader py={2} px={4} bg={`gray.100`}>Filter Records</DrawerHeader>

                    <DrawerBody>
                    <Flex align="flex-start" flexDir="column">
                        <Text mb={2} as="p" fontSize="sm">Sort by: </Text>
                        <Select mb={4} w={`auto`} onChange={(ev) => setSortBy(ev.target.value)} placeholder='Sort By' background="white" icon={<AiFillCaretDown fontSize="14px" />} size="sm" defaultValue={sortBy}>
                            {
                                data?.result?.tracking_page?.sort_by ?
                                    data.result.tracking_page.sort_by.map((
                                        { key, display }: { key: string, display: string }) => <option key={key} value={key}>{display}</option>
                                    )
                                    : <></>
                            }
                        </Select>
                    </Flex>

                    <Flex align="flex-start" flexDir="column">
                        <Text mb={2} as="p" fontSize="sm">Filter by: {filterBy.map((key: string, i: number) => <Tag mr={2} key={i}>{data?.result?.tracking_page?.filters?.find((filter: {key: string, display: string}) => filter.key === key).display}</Tag>)}</Text>
                        <Menu autoSelect={false} closeOnSelect={false}>
                            <MenuButton mb={4} background="white" fontSize="sm">
                                <Flex align="center" justifyContent="space-between" fontWeight="normal" className={styles.filterByButton}>
                                    {!!filterBy.length ? `${filterBy.length} Selected` : <Text as="span">Select filters</Text> }
                                    <AiFillCaretDown fontSize="14px" />
                                </Flex>
                            </MenuButton>
                            <MenuList>
                                {
                                    data?.result?.tracking_page?.filters ?
                                        data.result.tracking_page.filters.map((
                                            { key, display }: { key: string, display: string }) =>
                                            <MenuItem key={key}>
                                                <Checkbox isChecked={filterBy.includes(key)} onChange={($event) => onCheckboxChange($event, key)}>{display}</Checkbox>
                                            </MenuItem>
                                        )
                                        : <></>
                                }
                            </MenuList>
                        </Menu>
                    </Flex>

                        <Flex align="center" flexDir="row">
                            <Text mr={2}>Timeline: </Text>
                            <Menu autoSelect={false}>
                                <MenuButton as={Button} px={3} rightIcon={<AiFillCaretDown />} w="8.5rem" h={`2rem`} p={2} fontSize="sm">
                                    <Text fontWeight="normal" p={0}>{duration}</Text>
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
                    </DrawerBody>

                    <DrawerFooter py={2} px={4} bg={`gray.100`} justifyContent="flex-start" borderTop="1px solid var(--chakra-colors-gray-200)">
                        <Flex justify="flex-start">
                        <Button mr={4} colorScheme='teal' onClick={handleOnCloseDrawer} size="sm" h={`28px`}>
                                Search
                            </Button>
                            <Button bg={`white`} variant='outline' onClick={onClose} size="sm" h={`28px`}>
                                Close
                            </Button>
                        </Flex>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    )
}