import { Breadcrumb as BSBreadcrumb } from 'react-bootstrap'

export default function Breadcrumb() {
  return (
    <BSBreadcrumb listProps={{ className: 'my-0 ms-2 align-items-center' }}>
      <BSBreadcrumb.Item
        linkProps={{ className: 'text-decoration-none' }}
        href="/"
      >
        Shipments
      </BSBreadcrumb.Item>
      <BSBreadcrumb.Item
        linkProps={{ className: 'text-decoration-none' }}
        href="/"
      >
        Tracking List
      </BSBreadcrumb.Item>
      {/* <BSBreadcrumb.Item active>Data</BSBreadcrumb.Item> */}
    </BSBreadcrumb>
  )
}
