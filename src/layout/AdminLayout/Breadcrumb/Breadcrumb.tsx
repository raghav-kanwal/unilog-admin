import { useRouter } from 'next/router';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from '@chakra-ui/react'

export default function BreadcrumbComponent() {
  const router = useRouter();

  function generateBreadcrumbs() {
    // Remove any query parameters, as those aren't included in breadcrumbs
    const asPathWithoutQuery = router.asPath.split("?")[0];

    // Break down the path between "/"s, removing empty entities
    // Ex:"/my/nested/path" --> ["my", "nested", "path"]
    const asPathNestedRoutes = asPathWithoutQuery.split("/")
                                                 .filter(v => v.length > 0);

    // Iterate over the list of nested route parts and build
    // a "crumb" object for each one.
    const crumblist = asPathNestedRoutes.map((subpath, idx) => {
      // We can get the partial nested route for the crumb
      // by joining together the path parts up to this point.
      const href = "/" + asPathNestedRoutes.slice(0, idx + 1).join("/");
      // The title will just be the route string for now
      const title = subpath.charAt(0).toUpperCase() + subpath.slice(1);
      return { href, title }; 
    })

    // Add in a default "Home" crumb for the top-level
    if(router.asPath.indexOf('comingSoon') === -1) {
      return [{ href: "/", title: "Tracking" }, { href: "/", title: "Orders" }];
    } else {
      return [{ href: "/", title: "Home" }, ...crumblist];
    }
    
  }

  const breadcrumbs = generateBreadcrumbs();

  return (
    
    <Breadcrumb>
      
    {
      breadcrumbs.map((el, i) => {
        return (
          <BreadcrumbItem key={i}>
            <BreadcrumbLink href={el.href}>{el.title}</BreadcrumbLink>
          </BreadcrumbItem>
        )
      })
    }
    </Breadcrumb>
    // <BSBreadcrumb listProps={{ className: 'my-0 ms-0 align-items-center' }}>
    //   <BSBreadcrumb.Item
    //     linkProps={{ className: 'text-decoration-none' }}
    //     href="/"
    //   >
    //     Tracking
    //   </BSBreadcrumb.Item>
    //   <BSBreadcrumb.Item
    //     linkProps={{ className: 'text-decoration-none' }}
    //     href="/"
    //   >
    //     Orders
    //   </BSBreadcrumb.Item>
    //   {/* <BSBreadcrumb.Item active>Data</BSBreadcrumb.Item> */}
    // </BSBreadcrumb>
  )
}
