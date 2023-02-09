import { AdminLayout } from '@layout'
import { AiFillCaretDown } from "react-icons/ai";
import React, { useEffect, useState } from 'react'
import { Box, Flex, Input, Menu, MenuButton, MenuItem, MenuList, Text, Button, Card, CardHeader, CardBody, useToast } from '@chakra-ui/react'
import { Duration } from 'enums';
import { resolveDuration } from 'utils';
import ShipmentList from 'src/components/ShipmentList/ShipmentList';
import { Filters } from 'interfaces';
import FilterBar from 'src/components/FilterBar/FilterBar';

export default function Home() {

  const [filters, setFilters] = useState<Filters>({ searchText: '', from: '', to: '' });

  return (

    <AdminLayout>
      <div className="row">
        <div className="col-md-12">
          <Card className="mb-4">
            <CardHeader bg="gray.100" py={4}>
              <FilterBar setFilters={setFilters} />
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
