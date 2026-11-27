export function createRouter(store) {
    const routes = [];
    const basePath = "/phase-1-week-4";
    function getBasePath() {
        const pathname = window.location.pathname;
        if (pathname === basePath || pathname.startsWith(`${basePath}/`)) {
            return basePath;
        }
        return "";
    }

    function getAppPath(pathname = window.location.pathname) {
        const base = getBasePath();
        if (base && pathname.startsWith(base)) {
            return pathname.slice(base.length) || "/";
        }
        return pathname;
    }

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
        const base = getBasePath();
        let appPath = path;

        if (base && appPath.startsWith(`${base}/`)) {
            appPath = appPath.slice(base.length);
        }

        if (!appPath.startsWith("/")) {
            appPath = `/${appPath}`;
        }
        
        window.history.pushState({}, "", `${base}${appPath}`);
        renderRoute(getAppPath());
    }

    function handlePopState() {
        renderRoute(getAppPath());
    }

    function initRouter() {
        window.addEventListener("popstate", handlePopState);
        const currentPath = getAppPath();
        if (currentPath === "/") {
            navigate("/home");
        } else {
            renderRoute(currentPath);
        }
    }

    return {
        register,
        navigate,
        initRouter
    };
}
