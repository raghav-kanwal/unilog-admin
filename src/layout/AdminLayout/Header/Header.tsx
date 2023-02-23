import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import BreadcrumbComponent from '@layout/AdminLayout/Breadcrumb/Breadcrumb'
import HeaderFeaturedNav from '@layout/AdminLayout/Header/HeaderFeaturedNav'
import HeaderNotificationNav from '@layout/AdminLayout/Header/HeaderNotificationNav'
import HeaderProfileNav from '@layout/AdminLayout/Header/HeaderProfileNav'
import { Button, Container } from 'react-bootstrap'
import { Box, Text } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { fetchMetaData } from 'apis/get'

type HeaderProps = {
  toggleSidebar: () => void;
  toggleSidebarMd: () => void;
}

export default function Header(props: HeaderProps) {
  const { toggleSidebar, toggleSidebarMd } = props

  const { data } = useQuery({
    queryKey: ['fetchMetaData'],
    queryFn: fetchMetaData,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
});

  return (
    <header className="header sticky-top mb-3 p-2 border-bottom">
      <Container fluid className="header-navbar d-flex align-items-center">
        <Button
          variant="link"
          className="header-toggler d-md-none px-md-0 me-md-3 rounded-0 shadow-none"
          type="button"
          onClick={toggleSidebar}
        >
          <FontAwesomeIcon icon={faBars} />
        </Button>
        <Button
          variant="link"
          className="header-toggler d-none d-md-inline-block px-md-0 me-md-3 rounded-0 shadow-none"
          type="button"
          onClick={toggleSidebarMd}
        >
          <FontAwesomeIcon icon={faBars} />
        </Button>
        {/* <Link href="/" className="header-brand d-md-none">
          <svg width="118" height="46">
            <title>CoreUI Logo</title>
            <use xlinkHref="/assets/brand/coreui.svg#full" />
          </svg>
        </Link>
        <div className="header-nav d-none d-md-flex">
          <HeaderFeaturedNav />
        </div>
        <div className="header-nav ms-auto">
          <HeaderNotificationNav />
        </div> */}
        <Box className='header-nav' ml='auto'>
          <Text>Welcome{data?.tenant ? `, ${data.tenant}!` : ``}</Text>
        </Box>
        <Box className="header-nav ms-2">
          <HeaderProfileNav />
        </Box>
      </Container>
      <div className="header-divider border-top my-2 ms-n2 me-n2" />
      <Container fluid>
        <BreadcrumbComponent />
      </Container>
    </header>
  )
}
