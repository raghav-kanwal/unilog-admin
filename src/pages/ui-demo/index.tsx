import { Text } from '@chakra-ui/react';
import AdminLayout from '@layout/AdminLayout/AdminLayout';
import Datatable from 'src/components/datatable/datatable.component';

export default function UIDemo() {
    return (
        <AdminLayout>
        <Text>UI-Demo Page</Text>
        <Datatable />
        </AdminLayout>
    )
}