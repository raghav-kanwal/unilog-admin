import { AdminLayout } from '@layout'
import { AiFillCaretDown } from "react-icons/ai";
import React, { useEffect, useState, useRef } from 'react'
import TableComponent from 'src/components/Table/Table'
import { Box, Flex, Input, Menu, MenuButton, MenuItem, MenuList, Text, Button, Card, CardHeader, CardBody, useToast, IconButton, Tooltip } from '@chakra-ui/react'
import { Duration } from 'enums';
import { resolveDuration } from 'utils';
import { TbDownload } from 'react-icons/tb';
import * as PapaParse from 'papaparse';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const toast = useToast();

  const [shippingList, setShippingList] = useState<any[]>([]);
  const [duration, setDuration] = useState<Duration>(Duration.LAST_WEEK);

  const { from, to } = resolveDuration(duration, '', '');
  const [fromDate, setFromDate] = useState<string>(from);
  const [toDate, setToDate] = useState<string>(to);
  const csvLink = useRef()

  const API_HOST = "https://unilog.unicommerce.com" // "https://unilog.unicommerce.com", "http://localhost:8000"

  const parseDate = (oldDate: string): string => !oldDate ? "-" : (new Date(oldDate).toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  }));

  async function getDownloadableData(): Promise<any> {
    const res = await fetch(API_HOST + "/shipper/api/tracking-list", {
      method: "POST",
      headers: {
        'APP-KEY': '#$%^SK&SNLSH*^%SF'
      },
      body: JSON.stringify({ "search_text": searchQuery, "from": fromDate, "to": toDate })
    });

    if (!res.ok) throw new Error(res.statusText);

    return await res.json();
  }

  async function fetchShipmentList() {
    try {
      const days90InMiliSeconds = 90 * 24 * 60 * 60 * 1000;
      if (new Date(fromDate).getTime() + days90InMiliSeconds < new Date(toDate).getTime()) {
        toast({
          status: 'error',
          title: 'Maximum time range is 90 days',
          variant: 'left-accent',
          position: 'top-right',
          duration: 4000,
          isClosable: true,
        });
        return;
      }

      const res = await fetch(API_HOST + "/shipper/api/tracking-list", {
        method: "POST",
        headers: {
          'APP-KEY': '#$%^SK&SNLSH*^%SF'
        },
        body: JSON.stringify({ "search_text": searchQuery, "from": fromDate, "to": toDate })
      });

      if (!res.ok) throw new Error(res.statusText);

      const data = await res.json();
      setShippingList(data.result.tracking_records.map((row: any) => {
        return [
          <Box>
            <Text>AWB: {row.tracking_number}</Text>
            <Text>Courier: {row.shipping_source_code}</Text>
          </Box>,
          `${row.order_number}`,
          <Box>
            <Text>{row.customer_name}</Text>
            <Text>{row.customer_phone}</Text>
          </Box>,
          `${row.shipping_package_code}`,
          `${row.facility_code}`,
          `${row.current_wismo_display_status}`,
          <Text>{parseDate(row.order_datetime)}</Text>,
          <Text>{parseDate(row.dispatch_datetime)}</Text>,
          <Text>{parseDate(row.expected_delivered_datetime)}</Text>,
          <Text>{parseDate(row.delivered_datetime)}</Text>,
          `${row.no_of_items}`,
          `${row.tracking_number}`
        ]
      }))
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchShipmentList();
  }, [])

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

    fetchShipmentList();
  }

  const handleDownloadAsCSV = () => {
    const days90InMiliSeconds = 90 * 24 * 60 * 60 * 1000;
    if (new Date(fromDate).getTime() + days90InMiliSeconds < new Date(toDate).getTime()) {
      toast({
        status: 'error',
        title: 'Maximum time range is 90 days',
        variant: 'left-accent',
        position: 'top-right',
        duration: 4000,
        isClosable: true,
      });
      return;
    }
    
    const data = getDownloadableData().then(data => {
      console.log(data);
      if(!!data) {
        const csv = PapaParse.unparse(data);
        console.log(csv);
        const blob = new Blob([csv], {type: "text/csv"});
        const a = document.createElement("a");
        a.download = `Tracking_${new Date().toLocaleDateString('en-IN').split('/').join('')}_${new Date(fromDate).toLocaleDateString('en-IN').split('/').join('')}_${new Date(toDate).toLocaleDateString('en-IN').split('/').join('')}`;
        a.href = window.URL.createObjectURL(blob)
        const clickEvt = new MouseEvent('click', {
          view: window,
          bubbles: true,
          cancelable: true,
        })
        a.dispatchEvent(clickEvt)
        a.remove()
      }
    });
  }

  return (

    <AdminLayout>

      <div className="row">
        <div className="col-md-12">
          <Card className="mb-4">
            <CardHeader bg="gray.100" py={4}>
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
                  <Tooltip hasArrow label="Download as CSV">
                    <IconButton size="sm" colorScheme="teal" icon={<TbDownload />} aria-label={'download'} onClick={() => handleDownloadAsCSV()}></IconButton>
                  </Tooltip>
                  <a style={{display: "none"}} href="#" ref={csvLink}></a>
                  <Button colorScheme="teal" size="sm" onClick={handleSearch}>Search</Button>
                </Flex>
              </Flex>
            </CardHeader>
            <CardBody className="px-0 py-0" bg="white">
              <TableComponent parseDate={parseDate} shippingList={shippingList} />
            </CardBody>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
