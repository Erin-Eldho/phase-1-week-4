export function createRouter(store) {
    const routes = [];
    function register(path, component) {
        routes.push({ path, component });
    }

    function matchRoute(pathname) {
        const currentSegments = pathname.split("/").filter(Boolean);
        
        for (const route of routes) {
            const routeSegments = route.path.split("/").filter(Boolean);
            if (currentSegments.length !== routeSegments.length) {
                continue;
            }
            const params = {};
            let isMatch = true;

            for (let i = 0; i < routeSegments.length; i++) {
                const routeSegment = routeSegments[i];
                const currentSegment = currentSegments[i];

                if (routeSegment.startsWith(":")) {
                    const paramName = routeSegment.slice(1);
                    params[paramName] = decodeURIComponent(currentSegment);
                } else if (routeSegment !== currentSegment) {
                    isMatch = false;
                    break;
                }
            }

            if (isMatch) {
                return {
                    path: route.path,
                    component: route.component,
                    params
                };
            }
        }
        return null;
    }

    function renderRoute(pathname) {
        const matchedRoute = matchRoute(pathname);

        if (!matchedRoute) {
            store.dispatch({
                type: "SET_ROUTE", 
                payload: {
                    path: pathname,
                    params: {},
                    component: null
                }
            });
            return;
        }

        store.dispatch({
            type: "SET_ROUTE",
            payload: {
                path: pathname,
                params: matchedRoute.params,
                component: matchedRoute.component
            }
        });
    }

    function navigate(path) {
        window.history.pushState({}, "", path);
        renderRoute(window.location.pathname);
    }

    function handlePopState() {
        renderRoute(window.location.pathname);
    }

    function initRouter() {
        window.addEventListener("popstate", handlePopState);
        if (window.location.pathname === "/") {
            navigate("/home");
        } else {
            renderRoute(window.location.pathname);
        }
    }

    return {register, navigate, initRouter};
}
