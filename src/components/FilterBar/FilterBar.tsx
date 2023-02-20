import { Flex, Input, Button, Menu, MenuButton, MenuList, MenuItem, Box, Select, Checkbox, useDisclosure, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { fetchMetaData } from "apis/get";
import { Duration } from "src/shared/enums";
import { Filters } from "src/shared/interfaces";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { AiFillCaretDown } from "react-icons/ai";
import DownloadCSV from "../DownloadCSV/DownloadCSV";
import { useDate } from "src/shared/hooks";
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

    return (
        <>
            <Flex justifyContent="space-between" align="center">
                <Input value={searchQuery} placeholder="Search AWB/Order/Phone/Facility/Courier" w={`25%`} bg={`#fff`} onChange={(e) => setSearchQuery(e.target.value)} />
                <Flex gap={4}>

                    {/* <Flex>
                        <Select onChange={(ev) => setSortBy(ev.target.value)} placeholder='Sort By' background="white" icon={<AiFillCaretDown fontSize="14px" />} size="sm">
                            {
                                data?.result?.tracking_page?.sort_by ?
                                    data.result.tracking_page.sort_by.map((
                                        { key, display }: { key: string, display: string }) => <option key={key} value={key}>{display}</option>
                                    )
                                    : <></>
                            }
                        </Select>
                    </Flex> */}

                    {/* <Flex>
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
                    </Flex> */}

                    {/* <Flex align={`center`}>
                        <Text as="span" mb={2} fontSize="sm">Timeline: </Text>
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
                    </Flex> */}

                    <Button colorScheme="teal" size="sm" onClick={onOpen}>Filter Records</Button>

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
                        <Select mb={4} w={`auto`} onChange={(ev) => setSortBy(ev.target.value)} placeholder='Sort By' background="white" icon={<AiFillCaretDown fontSize="14px" />} size="sm">
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
                        <Text mb={2} as="p" fontSize="sm">Filter by: {filterBy.map((el: string, i) => <Text as="span" key={i}>{el.replace(/_/g, ' ')}{i != filterBy.length-1 ? ', ' : ''}</Text>)}</Text>
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
                                                <Checkbox onChange={($event) => onCheckboxChange($event, key)}>{display}</Checkbox>
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