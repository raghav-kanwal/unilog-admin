import { AdminLayout } from '@layout'
import { AiFillCaretDown } from "react-icons/ai";
import React, { useState } from 'react'
import TableComponent from 'src/components/Table/Table'
import { Box, Flex, Input, Menu, MenuButton, MenuItem, MenuList, Text, Button, Card, CardHeader, CardBody } from '@chakra-ui/react'
import { Duration } from 'enums'

export default function Home() {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [duration, setDuration] = useState<Duration>(Duration.LAST_WEEK);
  const [fromDate, setFromDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [toDate, setToDate] = useState<string>(new Date().toISOString().split('T')[0]);

  return (

    <AdminLayout>

      <div className="row">
        <div className="col-md-12">
          <Card className="mb-4">
            <CardHeader>
              <Flex justifyContent="space-between">
                <Input value={searchQuery} placeholder="Search AWB/Order number/Phone number" w={`30%`} bg={`#fff`} onChange={(e) => setSearchQuery(e.target.value)} />
                <Flex justifyContent="flex-end" align={`center`}>
                  <Text as="span" mr={2}>Timeline: </Text>
                  <Menu>
                    <MenuButton as={Button} rightIcon={<AiFillCaretDown />} w="8.5rem" h={`2rem`} p={2} fontSize="sm">
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
              </Flex>
            </CardHeader>
            <CardBody className="px-0 py-0">
              <TableComponent searchQuery={searchQuery} />
            </CardBody>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
