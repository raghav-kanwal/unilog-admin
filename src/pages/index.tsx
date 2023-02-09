import { AdminLayout } from '@layout'
import { AiFillCaretDown } from "react-icons/ai";
import React, { useEffect, useState } from 'react'
import { Box, Flex, Input, Menu, MenuButton, MenuItem, MenuList, Text, Button, Card, CardHeader, CardBody, useToast } from '@chakra-ui/react'
import { Duration } from 'enums';
import { resolveDuration } from 'utils';
import ShipmentList from 'src/components/ShipmentList/ShipmentList';
import { Filters } from 'interfaces';

export default function Home() {
  const toast = useToast();
  const { from, to } = resolveDuration(Duration.LAST_WEEK, '', '');

  const [toDate, setToDate] = useState<string>(to);
  const [fromDate, setFromDate] = useState<string>(from);
  const [duration, setDuration] = useState<Duration>(Duration.LAST_WEEK);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [filters, setFilters] = useState<Filters>({ searchText: searchQuery, from: fromDate, to: toDate });

  useEffect(() => {
    const { from, to } = resolveDuration(duration, fromDate, toDate);
    setFromDate(from);
    setToDate(to);
  }, [duration])

  const handleSearch = () => {
    if (new Date(fromDate).getTime() > new Date(toDate).getTime()) {
      toast({
        status: 'error',
        title: 'Invalid date range',
        variant: 'left-accent',
        position: 'top-right',
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    setFilters({
      searchText: searchQuery,
      from: fromDate,
      to: toDate,
    })
  }

  return (

    <AdminLayout>
      <div className="row">
        <div className="col-md-12">
          <Card className="mb-4">
            <CardHeader bg="gray.100" py={4}>
              <Flex justifyContent="space-between" align="center">
                <Input value={searchQuery} placeholder="Search AWB/Order number/Phone number" w={`30%`} bg={`#fff`} onChange={(e) => setSearchQuery(e.target.value)} />
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
                  <Button colorScheme="teal" size="sm" onClick={handleSearch}>Search</Button>
                </Flex>
              </Flex>
            </CardHeader>
            <CardBody className="px-0 py-0" bg="white">
              <ShipmentList filters={filters} />
            </CardBody>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
