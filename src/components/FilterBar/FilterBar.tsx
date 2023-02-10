import { Flex, Input, Button, Text, Menu, MenuButton, MenuList, MenuItem, Box, useToast } from "@chakra-ui/react";
import { Duration } from "enums";
import { Filters } from "interfaces";
import { useEffect, useState } from "react";
import { AiFillCaretDown } from "react-icons/ai";
import { resolveDuration } from "utils";
import DownloadCSV from "../DownloadCSV/DownloadCSV";

interface Props {
    filters: Filters;
    setFilters: Function;
}

export default function FilterBar({ filters, setFilters }: Props) {
    const toast = useToast();
    const { from, to } = resolveDuration(Duration.LAST_WEEK, '', '');

    const [toDate, setToDate] = useState<string>(to);
    const [fromDate, setFromDate] = useState<string>(from);
    const [duration, setDuration] = useState<Duration>(Duration.LAST_WEEK);
    const [searchQuery, setSearchQuery] = useState<string>('');

    useEffect(() => {
        setFilters({
            searchText: searchQuery,
            from: fromDate,
            to: toDate,
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
        })
    }

    return (
        <Flex justifyContent="space-between" align="center">
            <Input value={searchQuery} placeholder="Search AWB/Order/Phone/Facility/Courier" w={`30%`} bg={`#fff`} onChange={(e) => setSearchQuery(e.target.value)} />
            <Flex gap={4}>

                <Flex justifyContent="flex-end" align={`center`}>
                    <Text as="span" mr={2}>Timeline: </Text>
                    <Menu>
                        <MenuButton as={Button} bg={`white`} rightIcon={<AiFillCaretDown />} w="8.5rem" h={`2rem`} p={2} fontSize="sm">
                            {duration}
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