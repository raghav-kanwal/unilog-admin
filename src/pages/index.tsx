import { AdminLayout } from '@layout'
import { useState } from 'react'
import { Card, CardHeader, CardBody, useDisclosure } from '@chakra-ui/react'
import ShipmentList from 'src/components/ShipmentList/ShipmentList';
import { Filters } from 'src/shared/interfaces';
import FilterBar from 'src/components/FilterBar/FilterBar';
import { useQuery } from '@tanstack/react-query';
import { fetchMetaData } from 'apis/get';

export default function Home() {

  const { data } = useQuery({
    queryKey: ['fetchMetaData'],
    queryFn: fetchMetaData,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  const [filters, setFilters] = useState<Filters>({ searchText: '', from: '', to: '', sortBy: '', filterBy: [] });
  
  return (

    <AdminLayout>
      <div className="row">
        <div className="col-md-12">
          <Card className="mb-4">
            <CardHeader bg="gray.100" py={4}>
              <FilterBar filters={filters} setFilters={setFilters} />
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
