/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (function() { // webpackBootstrap
/******/ 	// runtime can't be in strict mode because a global variable is assign and maybe created.
/******/ 	var __webpack_modules__ = ({

/***/ "(app-pages-browser)/./src/workers/web-worker.ts":
/*!***********************************!*\
  !*** ./src/workers/web-worker.ts ***!
  \***********************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n// High-frequency trading data processing Web Worker\n// Handles heavy sorting, filtering, and data aggregation off the main thread\n// Data processing functions\nfunction processOrderData(orders) {\n    // Heavy data processing logic here\n    return orders.map((order)=>({\n            ...order,\n            processed: true,\n            processedAt: Date.now()\n        }));\n}\nfunction filterOrders(orders, filters) {\n    let filtered = [\n        ...orders\n    ];\n    filters.forEach((filter)=>{\n        filtered = filtered.filter((order)=>{\n            const value = order[filter.column];\n            const filterValue = filter.value;\n            switch(filter.operator){\n                case \"equals\":\n                    return value === filterValue;\n                case \"contains\":\n                    return String(value).toLowerCase().includes(String(filterValue).toLowerCase());\n                case \"greaterThan\":\n                    return Number(value) > Number(filterValue);\n                case \"lessThan\":\n                    return Number(value) < Number(filterValue);\n                case \"between\":\n                    return filter.values && Number(value) >= Number(filter.values[0]) && Number(value) <= Number(filter.values[1]);\n                case \"in\":\n                    return filter.values && filter.values.includes(value);\n                default:\n                    return true;\n            }\n        });\n    });\n    return filtered;\n}\nfunction sortOrders(orders, sortConfig) {\n    return [\n        ...orders\n    ].sort((a, b)=>{\n        const aValue = a[sortConfig.column];\n        const bValue = b[sortConfig.column];\n        if (aValue == null && bValue == null) return 0;\n        if (aValue == null) return 1;\n        if (bValue == null) return -1;\n        let comparison = 0;\n        if (aValue < bValue) comparison = -1;\n        if (aValue > bValue) comparison = 1;\n        return sortConfig.direction === \"desc\" ? -comparison : comparison;\n    });\n}\nfunction aggregateData(orders) {\n    let totalOrders = 0;\n    let totalValue = 0;\n    let totalDoneValue = 0;\n    let algoCount = 0;\n    let marketCount = 0;\n    orders.forEach((clientOrder)=>{\n        totalOrders++;\n        totalValue += clientOrder.orderValue;\n        totalDoneValue += clientOrder.doneValue;\n        clientOrder.algoOrders.forEach((algoOrder)=>{\n            algoCount++;\n            totalValue += algoOrder.orderValue;\n            totalDoneValue += algoOrder.doneValue;\n            algoOrder.marketOrders.forEach((marketOrder)=>{\n                marketCount++;\n                totalValue += marketOrder.orderValue;\n                totalDoneValue += marketOrder.doneValue;\n            });\n        });\n    });\n    return {\n        totalOrders: totalOrders + algoCount + marketCount,\n        clientOrders: orders.length,\n        algoOrders: algoCount,\n        marketOrders: marketCount,\n        totalValue,\n        totalDoneValue,\n        fillRate: totalValue > 0 ? totalDoneValue / totalValue * 100 : 0,\n        avgOrderSize: totalOrders > 0 ? totalValue / totalOrders : 0\n    };\n}\n// Message handler\nself.addEventListener(\"message\", (event)=>{\n    const { type, payload, requestId } = event.data;\n    let result;\n    try {\n        switch(type){\n            case \"PROCESS_DATA\":\n                result = processOrderData(payload.orders);\n                break;\n            case \"FILTER_DATA\":\n                result = filterOrders(payload.orders, payload.filters);\n                break;\n            case \"SORT_DATA\":\n                result = sortOrders(payload.orders, payload.sortConfig);\n                break;\n            case \"AGGREGATE_DATA\":\n                result = aggregateData(payload.orders);\n                break;\n            default:\n                throw new Error(\"Unknown message type: \".concat(type));\n        }\n        const response = {\n            type: \"\".concat(type, \"_SUCCESS\"),\n            payload: result,\n            requestId,\n            timestamp: Date.now()\n        };\n        self.postMessage(response);\n    } catch (error) {\n        const errorResponse = {\n            type: \"\".concat(type, \"_ERROR\"),\n            payload: {\n                error: error instanceof Error ? error.message : \"Unknown error\"\n            },\n            requestId,\n            timestamp: Date.now()\n        };\n        self.postMessage(errorResponse);\n    }\n});\n// Export for TypeScript\n\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL3NyYy93b3JrZXJzL3dlYi13b3JrZXIudHMiLCJtYXBwaW5ncyI6IjtBQUFBLG9EQUFvRDtBQUNwRCw2RUFBNkU7QUFpQjdFLDRCQUE0QjtBQUM1QixTQUFTQSxpQkFBaUJDLE1BQXFCO0lBQzdDLG1DQUFtQztJQUNuQyxPQUFPQSxPQUFPQyxHQUFHLENBQUNDLENBQUFBLFFBQVU7WUFDMUIsR0FBR0EsS0FBSztZQUNSQyxXQUFXO1lBQ1hDLGFBQWFDLEtBQUtDLEdBQUc7UUFDdkI7QUFDRjtBQUVBLFNBQVNDLGFBQWFQLE1BQXFCLEVBQUVRLE9BQXVCO0lBQ2xFLElBQUlDLFdBQVc7V0FBSVQ7S0FBTztJQUUxQlEsUUFBUUUsT0FBTyxDQUFDQyxDQUFBQTtRQUNkRixXQUFXQSxTQUFTRSxNQUFNLENBQUNULENBQUFBO1lBQ3pCLE1BQU1VLFFBQVFWLEtBQUssQ0FBQ1MsT0FBT0UsTUFBTSxDQUFDO1lBQ2xDLE1BQU1DLGNBQWNILE9BQU9DLEtBQUs7WUFFaEMsT0FBUUQsT0FBT0ksUUFBUTtnQkFDckIsS0FBSztvQkFDSCxPQUFPSCxVQUFVRTtnQkFDbkIsS0FBSztvQkFDSCxPQUFPRSxPQUFPSixPQUFPSyxXQUFXLEdBQUdDLFFBQVEsQ0FBQ0YsT0FBT0YsYUFBYUcsV0FBVztnQkFDN0UsS0FBSztvQkFDSCxPQUFPRSxPQUFPUCxTQUFTTyxPQUFPTDtnQkFDaEMsS0FBSztvQkFDSCxPQUFPSyxPQUFPUCxTQUFTTyxPQUFPTDtnQkFDaEMsS0FBSztvQkFDSCxPQUFPSCxPQUFPUyxNQUFNLElBQUlELE9BQU9QLFVBQVVPLE9BQU9SLE9BQU9TLE1BQU0sQ0FBQyxFQUFFLEtBQUtELE9BQU9QLFVBQVVPLE9BQU9SLE9BQU9TLE1BQU0sQ0FBQyxFQUFFO2dCQUMvRyxLQUFLO29CQUNILE9BQU9ULE9BQU9TLE1BQU0sSUFBSVQsT0FBT1MsTUFBTSxDQUFDRixRQUFRLENBQUNOO2dCQUNqRDtvQkFDRSxPQUFPO1lBQ1g7UUFDRjtJQUNGO0lBRUEsT0FBT0g7QUFDVDtBQUVBLFNBQVNZLFdBQVdyQixNQUFxQixFQUFFc0IsVUFBc0I7SUFDL0QsT0FBTztXQUFJdEI7S0FBTyxDQUFDdUIsSUFBSSxDQUFDLENBQUNDLEdBQUdDO1FBQzFCLE1BQU1DLFNBQVNGLENBQUMsQ0FBQ0YsV0FBV1QsTUFBTSxDQUFDO1FBQ25DLE1BQU1jLFNBQVNGLENBQUMsQ0FBQ0gsV0FBV1QsTUFBTSxDQUFDO1FBRW5DLElBQUlhLFVBQVUsUUFBUUMsVUFBVSxNQUFNLE9BQU87UUFDN0MsSUFBSUQsVUFBVSxNQUFNLE9BQU87UUFDM0IsSUFBSUMsVUFBVSxNQUFNLE9BQU8sQ0FBQztRQUU1QixJQUFJQyxhQUFhO1FBQ2pCLElBQUlGLFNBQVNDLFFBQVFDLGFBQWEsQ0FBQztRQUNuQyxJQUFJRixTQUFTQyxRQUFRQyxhQUFhO1FBRWxDLE9BQU9OLFdBQVdPLFNBQVMsS0FBSyxTQUFTLENBQUNELGFBQWFBO0lBQ3pEO0FBQ0Y7QUFFQSxTQUFTRSxjQUFjOUIsTUFBcUI7SUFDMUMsSUFBSStCLGNBQWM7SUFDbEIsSUFBSUMsYUFBYTtJQUNqQixJQUFJQyxpQkFBaUI7SUFDckIsSUFBSUMsWUFBWTtJQUNoQixJQUFJQyxjQUFjO0lBRWxCbkMsT0FBT1UsT0FBTyxDQUFDMEIsQ0FBQUE7UUFDYkw7UUFDQUMsY0FBY0ksWUFBWUMsVUFBVTtRQUNwQ0osa0JBQWtCRyxZQUFZRSxTQUFTO1FBRXZDRixZQUFZRyxVQUFVLENBQUM3QixPQUFPLENBQUM4QixDQUFBQTtZQUM3Qk47WUFDQUYsY0FBY1EsVUFBVUgsVUFBVTtZQUNsQ0osa0JBQWtCTyxVQUFVRixTQUFTO1lBRXJDRSxVQUFVQyxZQUFZLENBQUMvQixPQUFPLENBQUNnQyxDQUFBQTtnQkFDN0JQO2dCQUNBSCxjQUFjVSxZQUFZTCxVQUFVO2dCQUNwQ0osa0JBQWtCUyxZQUFZSixTQUFTO1lBQ3pDO1FBQ0Y7SUFDRjtJQUVBLE9BQU87UUFDTFAsYUFBYUEsY0FBY0csWUFBWUM7UUFDdkNRLGNBQWMzQyxPQUFPNEMsTUFBTTtRQUMzQkwsWUFBWUw7UUFDWk8sY0FBY047UUFDZEg7UUFDQUM7UUFDQVksVUFBVWIsYUFBYSxJQUFJLGlCQUFrQkEsYUFBYyxNQUFNO1FBQ2pFYyxjQUFjZixjQUFjLElBQUlDLGFBQWFELGNBQWM7SUFDN0Q7QUFDRjtBQUVBLGtCQUFrQjtBQUNsQmdCLEtBQUtDLGdCQUFnQixDQUFDLFdBQVcsQ0FBQ0M7SUFDaEMsTUFBTSxFQUFFQyxJQUFJLEVBQUVDLE9BQU8sRUFBRUMsU0FBUyxFQUFFLEdBQUdILE1BQU1JLElBQUk7SUFDL0MsSUFBSUM7SUFFSixJQUFJO1FBQ0YsT0FBUUo7WUFDTixLQUFLO2dCQUNISSxTQUFTdkQsaUJBQWlCb0QsUUFBUW5ELE1BQU07Z0JBQ3hDO1lBQ0YsS0FBSztnQkFDSHNELFNBQVMvQyxhQUFhNEMsUUFBUW5ELE1BQU0sRUFBRW1ELFFBQVEzQyxPQUFPO2dCQUNyRDtZQUNGLEtBQUs7Z0JBQ0g4QyxTQUFTakMsV0FBVzhCLFFBQVFuRCxNQUFNLEVBQUVtRCxRQUFRN0IsVUFBVTtnQkFDdEQ7WUFDRixLQUFLO2dCQUNIZ0MsU0FBU3hCLGNBQWNxQixRQUFRbkQsTUFBTTtnQkFDckM7WUFDRjtnQkFDRSxNQUFNLElBQUl1RCxNQUFNLHlCQUE4QixPQUFMTDtRQUM3QztRQUVBLE1BQU1NLFdBQTJCO1lBQy9CTixNQUFNLEdBQVEsT0FBTEEsTUFBSztZQUNkQyxTQUFTRztZQUNURjtZQUNBSyxXQUFXcEQsS0FBS0MsR0FBRztRQUNyQjtRQUVBeUMsS0FBS1csV0FBVyxDQUFDRjtJQUNuQixFQUFFLE9BQU9HLE9BQU87UUFDZCxNQUFNQyxnQkFBZ0M7WUFDcENWLE1BQU0sR0FBUSxPQUFMQSxNQUFLO1lBQ2RDLFNBQVM7Z0JBQUVRLE9BQU9BLGlCQUFpQkosUUFBUUksTUFBTUUsT0FBTyxHQUFHO1lBQWdCO1lBQzNFVDtZQUNBSyxXQUFXcEQsS0FBS0MsR0FBRztRQUNyQjtRQUVBeUMsS0FBS1csV0FBVyxDQUFDRTtJQUNuQjtBQUNGO0FBRUEsd0JBQXdCO0FBQ2QiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9fTl9FLy4vc3JjL3dvcmtlcnMvd2ViLXdvcmtlci50cz85NGVjIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIEhpZ2gtZnJlcXVlbmN5IHRyYWRpbmcgZGF0YSBwcm9jZXNzaW5nIFdlYiBXb3JrZXJcbi8vIEhhbmRsZXMgaGVhdnkgc29ydGluZywgZmlsdGVyaW5nLCBhbmQgZGF0YSBhZ2dyZWdhdGlvbiBvZmYgdGhlIG1haW4gdGhyZWFkXG5cbmltcG9ydCB7IENsaWVudE9yZGVyLCBBbGdvT3JkZXIsIE1hcmtldE9yZGVyLCBGaWx0ZXJDb25maWcsIFNvcnRDb25maWcgfSBmcm9tICdAcmVwby90eXBlcyc7XG5cbmludGVyZmFjZSBXb3JrZXJNZXNzYWdlIHtcbiAgdHlwZTogJ1BST0NFU1NfREFUQScgfCAnRklMVEVSX0RBVEEnIHwgJ1NPUlRfREFUQScgfCAnQUdHUkVHQVRFX0RBVEEnO1xuICBwYXlsb2FkOiBhbnk7XG4gIHJlcXVlc3RJZDogc3RyaW5nO1xufVxuXG5pbnRlcmZhY2UgV29ya2VyUmVzcG9uc2Uge1xuICB0eXBlOiBzdHJpbmc7XG4gIHBheWxvYWQ6IGFueTtcbiAgcmVxdWVzdElkOiBzdHJpbmc7XG4gIHRpbWVzdGFtcDogbnVtYmVyO1xufVxuXG4vLyBEYXRhIHByb2Nlc3NpbmcgZnVuY3Rpb25zXG5mdW5jdGlvbiBwcm9jZXNzT3JkZXJEYXRhKG9yZGVyczogQ2xpZW50T3JkZXJbXSk6IENsaWVudE9yZGVyW10ge1xuICAvLyBIZWF2eSBkYXRhIHByb2Nlc3NpbmcgbG9naWMgaGVyZVxuICByZXR1cm4gb3JkZXJzLm1hcChvcmRlciA9PiAoe1xuICAgIC4uLm9yZGVyLFxuICAgIHByb2Nlc3NlZDogdHJ1ZSxcbiAgICBwcm9jZXNzZWRBdDogRGF0ZS5ub3coKVxuICB9KSk7XG59XG5cbmZ1bmN0aW9uIGZpbHRlck9yZGVycyhvcmRlcnM6IENsaWVudE9yZGVyW10sIGZpbHRlcnM6IEZpbHRlckNvbmZpZ1tdKTogQ2xpZW50T3JkZXJbXSB7XG4gIGxldCBmaWx0ZXJlZCA9IFsuLi5vcmRlcnNdO1xuICBcbiAgZmlsdGVycy5mb3JFYWNoKGZpbHRlciA9PiB7XG4gICAgZmlsdGVyZWQgPSBmaWx0ZXJlZC5maWx0ZXIob3JkZXIgPT4ge1xuICAgICAgY29uc3QgdmFsdWUgPSBvcmRlcltmaWx0ZXIuY29sdW1uXTtcbiAgICAgIGNvbnN0IGZpbHRlclZhbHVlID0gZmlsdGVyLnZhbHVlO1xuICAgICAgXG4gICAgICBzd2l0Y2ggKGZpbHRlci5vcGVyYXRvcikge1xuICAgICAgICBjYXNlICdlcXVhbHMnOlxuICAgICAgICAgIHJldHVybiB2YWx1ZSA9PT0gZmlsdGVyVmFsdWU7XG4gICAgICAgIGNhc2UgJ2NvbnRhaW5zJzpcbiAgICAgICAgICByZXR1cm4gU3RyaW5nKHZhbHVlKS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKFN0cmluZyhmaWx0ZXJWYWx1ZSkudG9Mb3dlckNhc2UoKSk7XG4gICAgICAgIGNhc2UgJ2dyZWF0ZXJUaGFuJzpcbiAgICAgICAgICByZXR1cm4gTnVtYmVyKHZhbHVlKSA+IE51bWJlcihmaWx0ZXJWYWx1ZSk7XG4gICAgICAgIGNhc2UgJ2xlc3NUaGFuJzpcbiAgICAgICAgICByZXR1cm4gTnVtYmVyKHZhbHVlKSA8IE51bWJlcihmaWx0ZXJWYWx1ZSk7XG4gICAgICAgIGNhc2UgJ2JldHdlZW4nOlxuICAgICAgICAgIHJldHVybiBmaWx0ZXIudmFsdWVzICYmIE51bWJlcih2YWx1ZSkgPj0gTnVtYmVyKGZpbHRlci52YWx1ZXNbMF0pICYmIE51bWJlcih2YWx1ZSkgPD0gTnVtYmVyKGZpbHRlci52YWx1ZXNbMV0pO1xuICAgICAgICBjYXNlICdpbic6XG4gICAgICAgICAgcmV0dXJuIGZpbHRlci52YWx1ZXMgJiYgZmlsdGVyLnZhbHVlcy5pbmNsdWRlcyh2YWx1ZSk7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuICBcbiAgcmV0dXJuIGZpbHRlcmVkO1xufVxuXG5mdW5jdGlvbiBzb3J0T3JkZXJzKG9yZGVyczogQ2xpZW50T3JkZXJbXSwgc29ydENvbmZpZzogU29ydENvbmZpZyk6IENsaWVudE9yZGVyW10ge1xuICByZXR1cm4gWy4uLm9yZGVyc10uc29ydCgoYSwgYikgPT4ge1xuICAgIGNvbnN0IGFWYWx1ZSA9IGFbc29ydENvbmZpZy5jb2x1bW5dO1xuICAgIGNvbnN0IGJWYWx1ZSA9IGJbc29ydENvbmZpZy5jb2x1bW5dO1xuICAgIFxuICAgIGlmIChhVmFsdWUgPT0gbnVsbCAmJiBiVmFsdWUgPT0gbnVsbCkgcmV0dXJuIDA7XG4gICAgaWYgKGFWYWx1ZSA9PSBudWxsKSByZXR1cm4gMTtcbiAgICBpZiAoYlZhbHVlID09IG51bGwpIHJldHVybiAtMTtcbiAgICBcbiAgICBsZXQgY29tcGFyaXNvbiA9IDA7XG4gICAgaWYgKGFWYWx1ZSA8IGJWYWx1ZSkgY29tcGFyaXNvbiA9IC0xO1xuICAgIGlmIChhVmFsdWUgPiBiVmFsdWUpIGNvbXBhcmlzb24gPSAxO1xuICAgIFxuICAgIHJldHVybiBzb3J0Q29uZmlnLmRpcmVjdGlvbiA9PT0gJ2Rlc2MnID8gLWNvbXBhcmlzb24gOiBjb21wYXJpc29uO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gYWdncmVnYXRlRGF0YShvcmRlcnM6IENsaWVudE9yZGVyW10pIHtcbiAgbGV0IHRvdGFsT3JkZXJzID0gMDtcbiAgbGV0IHRvdGFsVmFsdWUgPSAwO1xuICBsZXQgdG90YWxEb25lVmFsdWUgPSAwO1xuICBsZXQgYWxnb0NvdW50ID0gMDtcbiAgbGV0IG1hcmtldENvdW50ID0gMDtcbiAgXG4gIG9yZGVycy5mb3JFYWNoKGNsaWVudE9yZGVyID0+IHtcbiAgICB0b3RhbE9yZGVycysrO1xuICAgIHRvdGFsVmFsdWUgKz0gY2xpZW50T3JkZXIub3JkZXJWYWx1ZTtcbiAgICB0b3RhbERvbmVWYWx1ZSArPSBjbGllbnRPcmRlci5kb25lVmFsdWU7XG4gICAgXG4gICAgY2xpZW50T3JkZXIuYWxnb09yZGVycy5mb3JFYWNoKGFsZ29PcmRlciA9PiB7XG4gICAgICBhbGdvQ291bnQrKztcbiAgICAgIHRvdGFsVmFsdWUgKz0gYWxnb09yZGVyLm9yZGVyVmFsdWU7XG4gICAgICB0b3RhbERvbmVWYWx1ZSArPSBhbGdvT3JkZXIuZG9uZVZhbHVlO1xuICAgICAgXG4gICAgICBhbGdvT3JkZXIubWFya2V0T3JkZXJzLmZvckVhY2gobWFya2V0T3JkZXIgPT4ge1xuICAgICAgICBtYXJrZXRDb3VudCsrO1xuICAgICAgICB0b3RhbFZhbHVlICs9IG1hcmtldE9yZGVyLm9yZGVyVmFsdWU7XG4gICAgICAgIHRvdGFsRG9uZVZhbHVlICs9IG1hcmtldE9yZGVyLmRvbmVWYWx1ZTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbiAgXG4gIHJldHVybiB7XG4gICAgdG90YWxPcmRlcnM6IHRvdGFsT3JkZXJzICsgYWxnb0NvdW50ICsgbWFya2V0Q291bnQsXG4gICAgY2xpZW50T3JkZXJzOiBvcmRlcnMubGVuZ3RoLFxuICAgIGFsZ29PcmRlcnM6IGFsZ29Db3VudCxcbiAgICBtYXJrZXRPcmRlcnM6IG1hcmtldENvdW50LFxuICAgIHRvdGFsVmFsdWUsXG4gICAgdG90YWxEb25lVmFsdWUsXG4gICAgZmlsbFJhdGU6IHRvdGFsVmFsdWUgPiAwID8gKHRvdGFsRG9uZVZhbHVlIC8gdG90YWxWYWx1ZSkgKiAxMDAgOiAwLFxuICAgIGF2Z09yZGVyU2l6ZTogdG90YWxPcmRlcnMgPiAwID8gdG90YWxWYWx1ZSAvIHRvdGFsT3JkZXJzIDogMFxuICB9O1xufVxuXG4vLyBNZXNzYWdlIGhhbmRsZXJcbnNlbGYuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIChldmVudDogTWVzc2FnZUV2ZW50PFdvcmtlck1lc3NhZ2U+KSA9PiB7XG4gIGNvbnN0IHsgdHlwZSwgcGF5bG9hZCwgcmVxdWVzdElkIH0gPSBldmVudC5kYXRhO1xuICBsZXQgcmVzdWx0OiBhbnk7XG4gIFxuICB0cnkge1xuICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgY2FzZSAnUFJPQ0VTU19EQVRBJzpcbiAgICAgICAgcmVzdWx0ID0gcHJvY2Vzc09yZGVyRGF0YShwYXlsb2FkLm9yZGVycyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnRklMVEVSX0RBVEEnOlxuICAgICAgICByZXN1bHQgPSBmaWx0ZXJPcmRlcnMocGF5bG9hZC5vcmRlcnMsIHBheWxvYWQuZmlsdGVycyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnU09SVF9EQVRBJzpcbiAgICAgICAgcmVzdWx0ID0gc29ydE9yZGVycyhwYXlsb2FkLm9yZGVycywgcGF5bG9hZC5zb3J0Q29uZmlnKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdBR0dSRUdBVEVfREFUQSc6XG4gICAgICAgIHJlc3VsdCA9IGFnZ3JlZ2F0ZURhdGEocGF5bG9hZC5vcmRlcnMpO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5rbm93biBtZXNzYWdlIHR5cGU6ICR7dHlwZX1gKTtcbiAgICB9XG4gICAgXG4gICAgY29uc3QgcmVzcG9uc2U6IFdvcmtlclJlc3BvbnNlID0ge1xuICAgICAgdHlwZTogYCR7dHlwZX1fU1VDQ0VTU2AsXG4gICAgICBwYXlsb2FkOiByZXN1bHQsXG4gICAgICByZXF1ZXN0SWQsXG4gICAgICB0aW1lc3RhbXA6IERhdGUubm93KClcbiAgICB9O1xuICAgIFxuICAgIHNlbGYucG9zdE1lc3NhZ2UocmVzcG9uc2UpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnN0IGVycm9yUmVzcG9uc2U6IFdvcmtlclJlc3BvbnNlID0ge1xuICAgICAgdHlwZTogYCR7dHlwZX1fRVJST1JgLFxuICAgICAgcGF5bG9hZDogeyBlcnJvcjogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiAnVW5rbm93biBlcnJvcicgfSxcbiAgICAgIHJlcXVlc3RJZCxcbiAgICAgIHRpbWVzdGFtcDogRGF0ZS5ub3coKVxuICAgIH07XG4gICAgXG4gICAgc2VsZi5wb3N0TWVzc2FnZShlcnJvclJlc3BvbnNlKTtcbiAgfVxufSk7XG5cbi8vIEV4cG9ydCBmb3IgVHlwZVNjcmlwdFxuZXhwb3J0IHt9O1xuIl0sIm5hbWVzIjpbInByb2Nlc3NPcmRlckRhdGEiLCJvcmRlcnMiLCJtYXAiLCJvcmRlciIsInByb2Nlc3NlZCIsInByb2Nlc3NlZEF0IiwiRGF0ZSIsIm5vdyIsImZpbHRlck9yZGVycyIsImZpbHRlcnMiLCJmaWx0ZXJlZCIsImZvckVhY2giLCJmaWx0ZXIiLCJ2YWx1ZSIsImNvbHVtbiIsImZpbHRlclZhbHVlIiwib3BlcmF0b3IiLCJTdHJpbmciLCJ0b0xvd2VyQ2FzZSIsImluY2x1ZGVzIiwiTnVtYmVyIiwidmFsdWVzIiwic29ydE9yZGVycyIsInNvcnRDb25maWciLCJzb3J0IiwiYSIsImIiLCJhVmFsdWUiLCJiVmFsdWUiLCJjb21wYXJpc29uIiwiZGlyZWN0aW9uIiwiYWdncmVnYXRlRGF0YSIsInRvdGFsT3JkZXJzIiwidG90YWxWYWx1ZSIsInRvdGFsRG9uZVZhbHVlIiwiYWxnb0NvdW50IiwibWFya2V0Q291bnQiLCJjbGllbnRPcmRlciIsIm9yZGVyVmFsdWUiLCJkb25lVmFsdWUiLCJhbGdvT3JkZXJzIiwiYWxnb09yZGVyIiwibWFya2V0T3JkZXJzIiwibWFya2V0T3JkZXIiLCJjbGllbnRPcmRlcnMiLCJsZW5ndGgiLCJmaWxsUmF0ZSIsImF2Z09yZGVyU2l6ZSIsInNlbGYiLCJhZGRFdmVudExpc3RlbmVyIiwiZXZlbnQiLCJ0eXBlIiwicGF5bG9hZCIsInJlcXVlc3RJZCIsImRhdGEiLCJyZXN1bHQiLCJFcnJvciIsInJlc3BvbnNlIiwidGltZXN0YW1wIiwicG9zdE1lc3NhZ2UiLCJlcnJvciIsImVycm9yUmVzcG9uc2UiLCJtZXNzYWdlIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(app-pages-browser)/./src/workers/web-worker.ts\n"));

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			if (cachedModule.error !== undefined) throw cachedModule.error;
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			var execOptions = { id: moduleId, module: module, factory: __webpack_modules__[moduleId], require: __webpack_require__ };
/******/ 			__webpack_require__.i.forEach(function(handler) { handler(execOptions); });
/******/ 			module = execOptions.module;
/******/ 			execOptions.factory.call(module.exports, module, module.exports, execOptions.require);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = __webpack_module_cache__;
/******/ 	
/******/ 	// expose the module execution interceptor
/******/ 	__webpack_require__.i = [];
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/get javascript update chunk filename */
/******/ 	!function() {
/******/ 		// This function allow to reference all chunks
/******/ 		__webpack_require__.hu = function(chunkId) {
/******/ 			// return url for filenames based on template
/******/ 			return "static/webpack/" + chunkId + "." + __webpack_require__.h() + ".hot-update.js";
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/get mini-css chunk filename */
/******/ 	!function() {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.miniCssF = function(chunkId) {
/******/ 			// return url for filenames based on template
/******/ 			return undefined;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/get update manifest filename */
/******/ 	!function() {
/******/ 		__webpack_require__.hmrF = function() { return "static/webpack/" + __webpack_require__.h() + ".67b668bf589392d7.hot-update.json"; };
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/getFullHash */
/******/ 	!function() {
/******/ 		__webpack_require__.h = function() { return "17e54d4d36a8c8c0"; }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/trusted types policy */
/******/ 	!function() {
/******/ 		var policy;
/******/ 		__webpack_require__.tt = function() {
/******/ 			// Create Trusted Type policy if Trusted Types are available and the policy doesn't exist yet.
/******/ 			if (policy === undefined) {
/******/ 				policy = {
/******/ 					createScript: function(script) { return script; },
/******/ 					createScriptURL: function(url) { return url; }
/******/ 				};
/******/ 				if (typeof trustedTypes !== "undefined" && trustedTypes.createPolicy) {
/******/ 					policy = trustedTypes.createPolicy("nextjs#bundler", policy);
/******/ 				}
/******/ 			}
/******/ 			return policy;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/trusted types script */
/******/ 	!function() {
/******/ 		__webpack_require__.ts = function(script) { return __webpack_require__.tt().createScript(script); };
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/trusted types script url */
/******/ 	!function() {
/******/ 		__webpack_require__.tu = function(url) { return __webpack_require__.tt().createScriptURL(url); };
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hot module replacement */
/******/ 	!function() {
/******/ 		var currentModuleData = {};
/******/ 		var installedModules = __webpack_require__.c;
/******/ 		
/******/ 		// module and require creation
/******/ 		var currentChildModule;
/******/ 		var currentParents = [];
/******/ 		
/******/ 		// status
/******/ 		var registeredStatusHandlers = [];
/******/ 		var currentStatus = "idle";
/******/ 		
/******/ 		// while downloading
/******/ 		var blockingPromises = 0;
/******/ 		var blockingPromisesWaiting = [];
/******/ 		
/******/ 		// The update info
/******/ 		var currentUpdateApplyHandlers;
/******/ 		var queuedInvalidatedModules;
/******/ 		
/******/ 		__webpack_require__.hmrD = currentModuleData;
/******/ 		
/******/ 		__webpack_require__.i.push(function (options) {
/******/ 			var module = options.module;
/******/ 			var require = createRequire(options.require, options.id);
/******/ 			module.hot = createModuleHotObject(options.id, module);
/******/ 			module.parents = currentParents;
/******/ 			module.children = [];
/******/ 			currentParents = [];
/******/ 			options.require = require;
/******/ 		});
/******/ 		
/******/ 		__webpack_require__.hmrC = {};
/******/ 		__webpack_require__.hmrI = {};
/******/ 		
/******/ 		function createRequire(require, moduleId) {
/******/ 			var me = installedModules[moduleId];
/******/ 			if (!me) return require;
/******/ 			var fn = function (request) {
/******/ 				if (me.hot.active) {
/******/ 					if (installedModules[request]) {
/******/ 						var parents = installedModules[request].parents;
/******/ 						if (parents.indexOf(moduleId) === -1) {
/******/ 							parents.push(moduleId);
/******/ 						}
/******/ 					} else {
/******/ 						currentParents = [moduleId];
/******/ 						currentChildModule = request;
/******/ 					}
/******/ 					if (me.children.indexOf(request) === -1) {
/******/ 						me.children.push(request);
/******/ 					}
/******/ 				} else {
/******/ 					console.warn(
/******/ 						"[HMR] unexpected require(" +
/******/ 							request +
/******/ 							") from disposed module " +
/******/ 							moduleId
/******/ 					);
/******/ 					currentParents = [];
/******/ 				}
/******/ 				return require(request);
/******/ 			};
/******/ 			var createPropertyDescriptor = function (name) {
/******/ 				return {
/******/ 					configurable: true,
/******/ 					enumerable: true,
/******/ 					get: function () {
/******/ 						return require[name];
/******/ 					},
/******/ 					set: function (value) {
/******/ 						require[name] = value;
/******/ 					}
/******/ 				};
/******/ 			};
/******/ 			for (var name in require) {
/******/ 				if (Object.prototype.hasOwnProperty.call(require, name) && name !== "e") {
/******/ 					Object.defineProperty(fn, name, createPropertyDescriptor(name));
/******/ 				}
/******/ 			}
/******/ 			fn.e = function (chunkId, fetchPriority) {
/******/ 				return trackBlockingPromise(require.e(chunkId, fetchPriority));
/******/ 			};
/******/ 			return fn;
/******/ 		}
/******/ 		
/******/ 		function createModuleHotObject(moduleId, me) {
/******/ 			var _main = currentChildModule !== moduleId;
/******/ 			var hot = {
/******/ 				// private stuff
/******/ 				_acceptedDependencies: {},
/******/ 				_acceptedErrorHandlers: {},
/******/ 				_declinedDependencies: {},
/******/ 				_selfAccepted: false,
/******/ 				_selfDeclined: false,
/******/ 				_selfInvalidated: false,
/******/ 				_disposeHandlers: [],
/******/ 				_main: _main,
/******/ 				_requireSelf: function () {
/******/ 					currentParents = me.parents.slice();
/******/ 					currentChildModule = _main ? undefined : moduleId;
/******/ 					__webpack_require__(moduleId);
/******/ 				},
/******/ 		
/******/ 				// Module API
/******/ 				active: true,
/******/ 				accept: function (dep, callback, errorHandler) {
/******/ 					if (dep === undefined) hot._selfAccepted = true;
/******/ 					else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 					else if (typeof dep === "object" && dep !== null) {
/******/ 						for (var i = 0; i < dep.length; i++) {
/******/ 							hot._acceptedDependencies[dep[i]] = callback || function () {};
/******/ 							hot._acceptedErrorHandlers[dep[i]] = errorHandler;
/******/ 						}
/******/ 					} else {
/******/ 						hot._acceptedDependencies[dep] = callback || function () {};
/******/ 						hot._acceptedErrorHandlers[dep] = errorHandler;
/******/ 					}
/******/ 				},
/******/ 				decline: function (dep) {
/******/ 					if (dep === undefined) hot._selfDeclined = true;
/******/ 					else if (typeof dep === "object" && dep !== null)
/******/ 						for (var i = 0; i < dep.length; i++)
/******/ 							hot._declinedDependencies[dep[i]] = true;
/******/ 					else hot._declinedDependencies[dep] = true;
/******/ 				},
/******/ 				dispose: function (callback) {
/******/ 					hot._disposeHandlers.push(callback);
/******/ 				},
/******/ 				addDisposeHandler: function (callback) {
/******/ 					hot._disposeHandlers.push(callback);
/******/ 				},
/******/ 				removeDisposeHandler: function (callback) {
/******/ 					var idx = hot._disposeHandlers.indexOf(callback);
/******/ 					if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 				},
/******/ 				invalidate: function () {
/******/ 					this._selfInvalidated = true;
/******/ 					switch (currentStatus) {
/******/ 						case "idle":
/******/ 							currentUpdateApplyHandlers = [];
/******/ 							Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 								__webpack_require__.hmrI[key](
/******/ 									moduleId,
/******/ 									currentUpdateApplyHandlers
/******/ 								);
/******/ 							});
/******/ 							setStatus("ready");
/******/ 							break;
/******/ 						case "ready":
/******/ 							Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 								__webpack_require__.hmrI[key](
/******/ 									moduleId,
/******/ 									currentUpdateApplyHandlers
/******/ 								);
/******/ 							});
/******/ 							break;
/******/ 						case "prepare":
/******/ 						case "check":
/******/ 						case "dispose":
/******/ 						case "apply":
/******/ 							(queuedInvalidatedModules = queuedInvalidatedModules || []).push(
/******/ 								moduleId
/******/ 							);
/******/ 							break;
/******/ 						default:
/******/ 							// ignore requests in error states
/******/ 							break;
/******/ 					}
/******/ 				},
/******/ 		
/******/ 				// Management API
/******/ 				check: hotCheck,
/******/ 				apply: hotApply,
/******/ 				status: function (l) {
/******/ 					if (!l) return currentStatus;
/******/ 					registeredStatusHandlers.push(l);
/******/ 				},
/******/ 				addStatusHandler: function (l) {
/******/ 					registeredStatusHandlers.push(l);
/******/ 				},
/******/ 				removeStatusHandler: function (l) {
/******/ 					var idx = registeredStatusHandlers.indexOf(l);
/******/ 					if (idx >= 0) registeredStatusHandlers.splice(idx, 1);
/******/ 				},
/******/ 		
/******/ 				//inherit from previous dispose call
/******/ 				data: currentModuleData[moduleId]
/******/ 			};
/******/ 			currentChildModule = undefined;
/******/ 			return hot;
/******/ 		}
/******/ 		
/******/ 		function setStatus(newStatus) {
/******/ 			currentStatus = newStatus;
/******/ 			var results = [];
/******/ 		
/******/ 			for (var i = 0; i < registeredStatusHandlers.length; i++)
/******/ 				results[i] = registeredStatusHandlers[i].call(null, newStatus);
/******/ 		
/******/ 			return Promise.all(results);
/******/ 		}
/******/ 		
/******/ 		function unblock() {
/******/ 			if (--blockingPromises === 0) {
/******/ 				setStatus("ready").then(function () {
/******/ 					if (blockingPromises === 0) {
/******/ 						var list = blockingPromisesWaiting;
/******/ 						blockingPromisesWaiting = [];
/******/ 						for (var i = 0; i < list.length; i++) {
/******/ 							list[i]();
/******/ 						}
/******/ 					}
/******/ 				});
/******/ 			}
/******/ 		}
/******/ 		
/******/ 		function trackBlockingPromise(promise) {
/******/ 			switch (currentStatus) {
/******/ 				case "ready":
/******/ 					setStatus("prepare");
/******/ 				/* fallthrough */
/******/ 				case "prepare":
/******/ 					blockingPromises++;
/******/ 					promise.then(unblock, unblock);
/******/ 					return promise;
/******/ 				default:
/******/ 					return promise;
/******/ 			}
/******/ 		}
/******/ 		
/******/ 		function waitForBlockingPromises(fn) {
/******/ 			if (blockingPromises === 0) return fn();
/******/ 			return new Promise(function (resolve) {
/******/ 				blockingPromisesWaiting.push(function () {
/******/ 					resolve(fn());
/******/ 				});
/******/ 			});
/******/ 		}
/******/ 		
/******/ 		function hotCheck(applyOnUpdate) {
/******/ 			if (currentStatus !== "idle") {
/******/ 				throw new Error("check() is only allowed in idle status");
/******/ 			}
/******/ 			return setStatus("check")
/******/ 				.then(__webpack_require__.hmrM)
/******/ 				.then(function (update) {
/******/ 					if (!update) {
/******/ 						return setStatus(applyInvalidatedModules() ? "ready" : "idle").then(
/******/ 							function () {
/******/ 								return null;
/******/ 							}
/******/ 						);
/******/ 					}
/******/ 		
/******/ 					return setStatus("prepare").then(function () {
/******/ 						var updatedModules = [];
/******/ 						currentUpdateApplyHandlers = [];
/******/ 		
/******/ 						return Promise.all(
/******/ 							Object.keys(__webpack_require__.hmrC).reduce(function (
/******/ 								promises,
/******/ 								key
/******/ 							) {
/******/ 								__webpack_require__.hmrC[key](
/******/ 									update.c,
/******/ 									update.r,
/******/ 									update.m,
/******/ 									promises,
/******/ 									currentUpdateApplyHandlers,
/******/ 									updatedModules
/******/ 								);
/******/ 								return promises;
/******/ 							}, [])
/******/ 						).then(function () {
/******/ 							return waitForBlockingPromises(function () {
/******/ 								if (applyOnUpdate) {
/******/ 									return internalApply(applyOnUpdate);
/******/ 								} else {
/******/ 									return setStatus("ready").then(function () {
/******/ 										return updatedModules;
/******/ 									});
/******/ 								}
/******/ 							});
/******/ 						});
/******/ 					});
/******/ 				});
/******/ 		}
/******/ 		
/******/ 		function hotApply(options) {
/******/ 			if (currentStatus !== "ready") {
/******/ 				return Promise.resolve().then(function () {
/******/ 					throw new Error(
/******/ 						"apply() is only allowed in ready status (state: " +
/******/ 							currentStatus +
/******/ 							")"
/******/ 					);
/******/ 				});
/******/ 			}
/******/ 			return internalApply(options);
/******/ 		}
/******/ 		
/******/ 		function internalApply(options) {
/******/ 			options = options || {};
/******/ 		
/******/ 			applyInvalidatedModules();
/******/ 		
/******/ 			var results = currentUpdateApplyHandlers.map(function (handler) {
/******/ 				return handler(options);
/******/ 			});
/******/ 			currentUpdateApplyHandlers = undefined;
/******/ 		
/******/ 			var errors = results
/******/ 				.map(function (r) {
/******/ 					return r.error;
/******/ 				})
/******/ 				.filter(Boolean);
/******/ 		
/******/ 			if (errors.length > 0) {
/******/ 				return setStatus("abort").then(function () {
/******/ 					throw errors[0];
/******/ 				});
/******/ 			}
/******/ 		
/******/ 			// Now in "dispose" phase
/******/ 			var disposePromise = setStatus("dispose");
/******/ 		
/******/ 			results.forEach(function (result) {
/******/ 				if (result.dispose) result.dispose();
/******/ 			});
/******/ 		
/******/ 			// Now in "apply" phase
/******/ 			var applyPromise = setStatus("apply");
/******/ 		
/******/ 			var error;
/******/ 			var reportError = function (err) {
/******/ 				if (!error) error = err;
/******/ 			};
/******/ 		
/******/ 			var outdatedModules = [];
/******/ 			results.forEach(function (result) {
/******/ 				if (result.apply) {
/******/ 					var modules = result.apply(reportError);
/******/ 					if (modules) {
/******/ 						for (var i = 0; i < modules.length; i++) {
/******/ 							outdatedModules.push(modules[i]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			});
/******/ 		
/******/ 			return Promise.all([disposePromise, applyPromise]).then(function () {
/******/ 				// handle errors in accept handlers and self accepted module load
/******/ 				if (error) {
/******/ 					return setStatus("fail").then(function () {
/******/ 						throw error;
/******/ 					});
/******/ 				}
/******/ 		
/******/ 				if (queuedInvalidatedModules) {
/******/ 					return internalApply(options).then(function (list) {
/******/ 						outdatedModules.forEach(function (moduleId) {
/******/ 							if (list.indexOf(moduleId) < 0) list.push(moduleId);
/******/ 						});
/******/ 						return list;
/******/ 					});
/******/ 				}
/******/ 		
/******/ 				return setStatus("idle").then(function () {
/******/ 					return outdatedModules;
/******/ 				});
/******/ 			});
/******/ 		}
/******/ 		
/******/ 		function applyInvalidatedModules() {
/******/ 			if (queuedInvalidatedModules) {
/******/ 				if (!currentUpdateApplyHandlers) currentUpdateApplyHandlers = [];
/******/ 				Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 					queuedInvalidatedModules.forEach(function (moduleId) {
/******/ 						__webpack_require__.hmrI[key](
/******/ 							moduleId,
/******/ 							currentUpdateApplyHandlers
/******/ 						);
/******/ 					});
/******/ 				});
/******/ 				queuedInvalidatedModules = undefined;
/******/ 				return true;
/******/ 			}
/******/ 		}
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	!function() {
/******/ 		__webpack_require__.p = "/_next/";
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/react refresh */
/******/ 	!function() {
/******/ 		if (__webpack_require__.i) {
/******/ 		__webpack_require__.i.push(function(options) {
/******/ 			var originalFactory = options.factory;
/******/ 			options.factory = function(moduleObject, moduleExports, webpackRequire) {
/******/ 				var hasRefresh = typeof self !== "undefined" && !!self.$RefreshInterceptModuleExecution$;
/******/ 				var cleanup = hasRefresh ? self.$RefreshInterceptModuleExecution$(moduleObject.id) : function() {};
/******/ 				try {
/******/ 					originalFactory.call(this, moduleObject, moduleExports, webpackRequire);
/******/ 				} finally {
/******/ 					cleanup();
/******/ 				}
/******/ 			}
/******/ 		})
/******/ 		}
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	
/******/ 	// noop fns to prevent runtime errors during initialization
/******/ 	if (typeof self !== "undefined") {
/******/ 		self.$RefreshReg$ = function () {};
/******/ 		self.$RefreshSig$ = function () {
/******/ 			return function (type) {
/******/ 				return type;
/******/ 			};
/******/ 		};
/******/ 	}
/******/ 	
/******/ 	/* webpack/runtime/css loading */
/******/ 	!function() {
/******/ 		var createStylesheet = function(chunkId, fullhref, resolve, reject) {
/******/ 			var linkTag = document.createElement("link");
/******/ 		
/******/ 			linkTag.rel = "stylesheet";
/******/ 			linkTag.type = "text/css";
/******/ 			var onLinkComplete = function(event) {
/******/ 				// avoid mem leaks.
/******/ 				linkTag.onerror = linkTag.onload = null;
/******/ 				if (event.type === 'load') {
/******/ 					resolve();
/******/ 				} else {
/******/ 					var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 					var realHref = event && event.target && event.target.href || fullhref;
/******/ 					var err = new Error("Loading CSS chunk " + chunkId + " failed.\n(" + realHref + ")");
/******/ 					err.code = "CSS_CHUNK_LOAD_FAILED";
/******/ 					err.type = errorType;
/******/ 					err.request = realHref;
/******/ 					linkTag.parentNode.removeChild(linkTag)
/******/ 					reject(err);
/******/ 				}
/******/ 			}
/******/ 			linkTag.onerror = linkTag.onload = onLinkComplete;
/******/ 			linkTag.href = fullhref;
/******/ 		
/******/ 			document.head.appendChild(linkTag);
/******/ 			return linkTag;
/******/ 		};
/******/ 		var findStylesheet = function(href, fullhref) {
/******/ 			var existingLinkTags = document.getElementsByTagName("link");
/******/ 			for(var i = 0; i < existingLinkTags.length; i++) {
/******/ 				var tag = existingLinkTags[i];
/******/ 				var dataHref = tag.getAttribute("data-href") || tag.getAttribute("href");
/******/ 				if(tag.rel === "stylesheet" && (dataHref === href || dataHref === fullhref)) return tag;
/******/ 			}
/******/ 			var existingStyleTags = document.getElementsByTagName("style");
/******/ 			for(var i = 0; i < existingStyleTags.length; i++) {
/******/ 				var tag = existingStyleTags[i];
/******/ 				var dataHref = tag.getAttribute("data-href");
/******/ 				if(dataHref === href || dataHref === fullhref) return tag;
/******/ 			}
/******/ 		};
/******/ 		var loadStylesheet = function(chunkId) {
/******/ 			return new Promise(function(resolve, reject) {
/******/ 				var href = __webpack_require__.miniCssF(chunkId);
/******/ 				var fullhref = __webpack_require__.p + href;
/******/ 				if(findStylesheet(href, fullhref)) return resolve();
/******/ 				createStylesheet(chunkId, fullhref, resolve, reject);
/******/ 			});
/******/ 		}
/******/ 		// no chunk loading
/******/ 		
/******/ 		var oldTags = [];
/******/ 		var newTags = [];
/******/ 		var applyHandler = function(options) {
/******/ 			return { dispose: function() {
/******/ 				for(var i = 0; i < oldTags.length; i++) {
/******/ 					var oldTag = oldTags[i];
/******/ 					if(oldTag.parentNode) oldTag.parentNode.removeChild(oldTag);
/******/ 				}
/******/ 				oldTags.length = 0;
/******/ 			}, apply: function() {
/******/ 				for(var i = 0; i < newTags.length; i++) newTags[i].rel = "stylesheet";
/******/ 				newTags.length = 0;
/******/ 			} };
/******/ 		}
/******/ 		__webpack_require__.hmrC.miniCss = function(chunkIds, removedChunks, removedModules, promises, applyHandlers, updatedModulesList) {
/******/ 			applyHandlers.push(applyHandler);
/******/ 			chunkIds.forEach(function(chunkId) {
/******/ 				var href = __webpack_require__.miniCssF(chunkId);
/******/ 				var fullhref = __webpack_require__.p + href;
/******/ 				var oldTag = findStylesheet(href, fullhref);
/******/ 				if(!oldTag) return;
/******/ 				promises.push(new Promise(function(resolve, reject) {
/******/ 					var tag = createStylesheet(chunkId, fullhref, function() {
/******/ 						tag.as = "style";
/******/ 						tag.rel = "preload";
/******/ 						resolve();
/******/ 					}, reject);
/******/ 					oldTags.push(oldTag);
/******/ 					newTags.push(tag);
/******/ 				}));
/******/ 			});
/******/ 		}
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/importScripts chunk loading */
/******/ 	!function() {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded chunks
/******/ 		// "1" means "already loaded"
/******/ 		var installedChunks = __webpack_require__.hmrS_importScripts = __webpack_require__.hmrS_importScripts || {
/******/ 			"_app-pages-browser_src_workers_web-worker_ts": 1
/******/ 		};
/******/ 		
/******/ 		// no chunk install function needed
/******/ 		// no chunk loading
/******/ 		
/******/ 		function loadUpdateChunk(chunkId, updatedModulesList) {
/******/ 			var success = false;
/******/ 			self["webpackHotUpdate_N_E"] = function(_, moreModules, runtime) {
/******/ 				for(var moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						currentUpdate[moduleId] = moreModules[moduleId];
/******/ 						if(updatedModulesList) updatedModulesList.push(moduleId);
/******/ 					}
/******/ 				}
/******/ 				if(runtime) currentUpdateRuntime.push(runtime);
/******/ 				success = true;
/******/ 			};
/******/ 			// start update chunk loading
/******/ 			importScripts(__webpack_require__.tu(__webpack_require__.p + __webpack_require__.hu(chunkId)));
/******/ 			if(!success) throw new Error("Loading update chunk failed for unknown reason");
/******/ 		}
/******/ 		
/******/ 		var currentUpdateChunks;
/******/ 		var currentUpdate;
/******/ 		var currentUpdateRemovedChunks;
/******/ 		var currentUpdateRuntime;
/******/ 		function applyHandler(options) {
/******/ 			if (__webpack_require__.f) delete __webpack_require__.f.importScriptsHmr;
/******/ 			currentUpdateChunks = undefined;
/******/ 			function getAffectedModuleEffects(updateModuleId) {
/******/ 				var outdatedModules = [updateModuleId];
/******/ 				var outdatedDependencies = {};
/******/ 		
/******/ 				var queue = outdatedModules.map(function (id) {
/******/ 					return {
/******/ 						chain: [id],
/******/ 						id: id
/******/ 					};
/******/ 				});
/******/ 				while (queue.length > 0) {
/******/ 					var queueItem = queue.pop();
/******/ 					var moduleId = queueItem.id;
/******/ 					var chain = queueItem.chain;
/******/ 					var module = __webpack_require__.c[moduleId];
/******/ 					if (
/******/ 						!module ||
/******/ 						(module.hot._selfAccepted && !module.hot._selfInvalidated)
/******/ 					)
/******/ 						continue;
/******/ 					if (module.hot._selfDeclined) {
/******/ 						return {
/******/ 							type: "self-declined",
/******/ 							chain: chain,
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					if (module.hot._main) {
/******/ 						return {
/******/ 							type: "unaccepted",
/******/ 							chain: chain,
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					for (var i = 0; i < module.parents.length; i++) {
/******/ 						var parentId = module.parents[i];
/******/ 						var parent = __webpack_require__.c[parentId];
/******/ 						if (!parent) continue;
/******/ 						if (parent.hot._declinedDependencies[moduleId]) {
/******/ 							return {
/******/ 								type: "declined",
/******/ 								chain: chain.concat([parentId]),
/******/ 								moduleId: moduleId,
/******/ 								parentId: parentId
/******/ 							};
/******/ 						}
/******/ 						if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 						if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 							if (!outdatedDependencies[parentId])
/******/ 								outdatedDependencies[parentId] = [];
/******/ 							addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 							continue;
/******/ 						}
/******/ 						delete outdatedDependencies[parentId];
/******/ 						outdatedModules.push(parentId);
/******/ 						queue.push({
/******/ 							chain: chain.concat([parentId]),
/******/ 							id: parentId
/******/ 						});
/******/ 					}
/******/ 				}
/******/ 		
/******/ 				return {
/******/ 					type: "accepted",
/******/ 					moduleId: updateModuleId,
/******/ 					outdatedModules: outdatedModules,
/******/ 					outdatedDependencies: outdatedDependencies
/******/ 				};
/******/ 			}
/******/ 		
/******/ 			function addAllToSet(a, b) {
/******/ 				for (var i = 0; i < b.length; i++) {
/******/ 					var item = b[i];
/******/ 					if (a.indexOf(item) === -1) a.push(item);
/******/ 				}
/******/ 			}
/******/ 		
/******/ 			// at begin all updates modules are outdated
/******/ 			// the "outdated" status can propagate to parents if they don't accept the children
/******/ 			var outdatedDependencies = {};
/******/ 			var outdatedModules = [];
/******/ 			var appliedUpdate = {};
/******/ 		
/******/ 			var warnUnexpectedRequire = function warnUnexpectedRequire(module) {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" + module.id + ") to disposed module"
/******/ 				);
/******/ 			};
/******/ 		
/******/ 			for (var moduleId in currentUpdate) {
/******/ 				if (__webpack_require__.o(currentUpdate, moduleId)) {
/******/ 					var newModuleFactory = currentUpdate[moduleId];
/******/ 					/** @type {TODO} */
/******/ 					var result;
/******/ 					if (newModuleFactory) {
/******/ 						result = getAffectedModuleEffects(moduleId);
/******/ 					} else {
/******/ 						result = {
/******/ 							type: "disposed",
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					/** @type {Error|false} */
/******/ 					var abortError = false;
/******/ 					var doApply = false;
/******/ 					var doDispose = false;
/******/ 					var chainInfo = "";
/******/ 					if (result.chain) {
/******/ 						chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 					}
/******/ 					switch (result.type) {
/******/ 						case "self-declined":
/******/ 							if (options.onDeclined) options.onDeclined(result);
/******/ 							if (!options.ignoreDeclined)
/******/ 								abortError = new Error(
/******/ 									"Aborted because of self decline: " +
/******/ 										result.moduleId +
/******/ 										chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "declined":
/******/ 							if (options.onDeclined) options.onDeclined(result);
/******/ 							if (!options.ignoreDeclined)
/******/ 								abortError = new Error(
/******/ 									"Aborted because of declined dependency: " +
/******/ 										result.moduleId +
/******/ 										" in " +
/******/ 										result.parentId +
/******/ 										chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "unaccepted":
/******/ 							if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 							if (!options.ignoreUnaccepted)
/******/ 								abortError = new Error(
/******/ 									"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "accepted":
/******/ 							if (options.onAccepted) options.onAccepted(result);
/******/ 							doApply = true;
/******/ 							break;
/******/ 						case "disposed":
/******/ 							if (options.onDisposed) options.onDisposed(result);
/******/ 							doDispose = true;
/******/ 							break;
/******/ 						default:
/******/ 							throw new Error("Unexception type " + result.type);
/******/ 					}
/******/ 					if (abortError) {
/******/ 						return {
/******/ 							error: abortError
/******/ 						};
/******/ 					}
/******/ 					if (doApply) {
/******/ 						appliedUpdate[moduleId] = newModuleFactory;
/******/ 						addAllToSet(outdatedModules, result.outdatedModules);
/******/ 						for (moduleId in result.outdatedDependencies) {
/******/ 							if (__webpack_require__.o(result.outdatedDependencies, moduleId)) {
/******/ 								if (!outdatedDependencies[moduleId])
/******/ 									outdatedDependencies[moduleId] = [];
/******/ 								addAllToSet(
/******/ 									outdatedDependencies[moduleId],
/******/ 									result.outdatedDependencies[moduleId]
/******/ 								);
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 					if (doDispose) {
/******/ 						addAllToSet(outdatedModules, [result.moduleId]);
/******/ 						appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 			currentUpdate = undefined;
/******/ 		
/******/ 			// Store self accepted outdated modules to require them later by the module system
/******/ 			var outdatedSelfAcceptedModules = [];
/******/ 			for (var j = 0; j < outdatedModules.length; j++) {
/******/ 				var outdatedModuleId = outdatedModules[j];
/******/ 				var module = __webpack_require__.c[outdatedModuleId];
/******/ 				if (
/******/ 					module &&
/******/ 					(module.hot._selfAccepted || module.hot._main) &&
/******/ 					// removed self-accepted modules should not be required
/******/ 					appliedUpdate[outdatedModuleId] !== warnUnexpectedRequire &&
/******/ 					// when called invalidate self-accepting is not possible
/******/ 					!module.hot._selfInvalidated
/******/ 				) {
/******/ 					outdatedSelfAcceptedModules.push({
/******/ 						module: outdatedModuleId,
/******/ 						require: module.hot._requireSelf,
/******/ 						errorHandler: module.hot._selfAccepted
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 		
/******/ 			var moduleOutdatedDependencies;
/******/ 		
/******/ 			return {
/******/ 				dispose: function () {
/******/ 					currentUpdateRemovedChunks.forEach(function (chunkId) {
/******/ 						delete installedChunks[chunkId];
/******/ 					});
/******/ 					currentUpdateRemovedChunks = undefined;
/******/ 		
/******/ 					var idx;
/******/ 					var queue = outdatedModules.slice();
/******/ 					while (queue.length > 0) {
/******/ 						var moduleId = queue.pop();
/******/ 						var module = __webpack_require__.c[moduleId];
/******/ 						if (!module) continue;
/******/ 		
/******/ 						var data = {};
/******/ 		
/******/ 						// Call dispose handlers
/******/ 						var disposeHandlers = module.hot._disposeHandlers;
/******/ 						for (j = 0; j < disposeHandlers.length; j++) {
/******/ 							disposeHandlers[j].call(null, data);
/******/ 						}
/******/ 						__webpack_require__.hmrD[moduleId] = data;
/******/ 		
/******/ 						// disable module (this disables requires from this module)
/******/ 						module.hot.active = false;
/******/ 		
/******/ 						// remove module from cache
/******/ 						delete __webpack_require__.c[moduleId];
/******/ 		
/******/ 						// when disposing there is no need to call dispose handler
/******/ 						delete outdatedDependencies[moduleId];
/******/ 		
/******/ 						// remove "parents" references from all children
/******/ 						for (j = 0; j < module.children.length; j++) {
/******/ 							var child = __webpack_require__.c[module.children[j]];
/******/ 							if (!child) continue;
/******/ 							idx = child.parents.indexOf(moduleId);
/******/ 							if (idx >= 0) {
/******/ 								child.parents.splice(idx, 1);
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// remove outdated dependency from module children
/******/ 					var dependency;
/******/ 					for (var outdatedModuleId in outdatedDependencies) {
/******/ 						if (__webpack_require__.o(outdatedDependencies, outdatedModuleId)) {
/******/ 							module = __webpack_require__.c[outdatedModuleId];
/******/ 							if (module) {
/******/ 								moduleOutdatedDependencies =
/******/ 									outdatedDependencies[outdatedModuleId];
/******/ 								for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 									dependency = moduleOutdatedDependencies[j];
/******/ 									idx = module.children.indexOf(dependency);
/******/ 									if (idx >= 0) module.children.splice(idx, 1);
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				},
/******/ 				apply: function (reportError) {
/******/ 					// insert new code
/******/ 					for (var updateModuleId in appliedUpdate) {
/******/ 						if (__webpack_require__.o(appliedUpdate, updateModuleId)) {
/******/ 							__webpack_require__.m[updateModuleId] = appliedUpdate[updateModuleId];
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// run new runtime modules
/******/ 					for (var i = 0; i < currentUpdateRuntime.length; i++) {
/******/ 						currentUpdateRuntime[i](__webpack_require__);
/******/ 					}
/******/ 		
/******/ 					// call accept handlers
/******/ 					for (var outdatedModuleId in outdatedDependencies) {
/******/ 						if (__webpack_require__.o(outdatedDependencies, outdatedModuleId)) {
/******/ 							var module = __webpack_require__.c[outdatedModuleId];
/******/ 							if (module) {
/******/ 								moduleOutdatedDependencies =
/******/ 									outdatedDependencies[outdatedModuleId];
/******/ 								var callbacks = [];
/******/ 								var errorHandlers = [];
/******/ 								var dependenciesForCallbacks = [];
/******/ 								for (var j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 									var dependency = moduleOutdatedDependencies[j];
/******/ 									var acceptCallback =
/******/ 										module.hot._acceptedDependencies[dependency];
/******/ 									var errorHandler =
/******/ 										module.hot._acceptedErrorHandlers[dependency];
/******/ 									if (acceptCallback) {
/******/ 										if (callbacks.indexOf(acceptCallback) !== -1) continue;
/******/ 										callbacks.push(acceptCallback);
/******/ 										errorHandlers.push(errorHandler);
/******/ 										dependenciesForCallbacks.push(dependency);
/******/ 									}
/******/ 								}
/******/ 								for (var k = 0; k < callbacks.length; k++) {
/******/ 									try {
/******/ 										callbacks[k].call(null, moduleOutdatedDependencies);
/******/ 									} catch (err) {
/******/ 										if (typeof errorHandlers[k] === "function") {
/******/ 											try {
/******/ 												errorHandlers[k](err, {
/******/ 													moduleId: outdatedModuleId,
/******/ 													dependencyId: dependenciesForCallbacks[k]
/******/ 												});
/******/ 											} catch (err2) {
/******/ 												if (options.onErrored) {
/******/ 													options.onErrored({
/******/ 														type: "accept-error-handler-errored",
/******/ 														moduleId: outdatedModuleId,
/******/ 														dependencyId: dependenciesForCallbacks[k],
/******/ 														error: err2,
/******/ 														originalError: err
/******/ 													});
/******/ 												}
/******/ 												if (!options.ignoreErrored) {
/******/ 													reportError(err2);
/******/ 													reportError(err);
/******/ 												}
/******/ 											}
/******/ 										} else {
/******/ 											if (options.onErrored) {
/******/ 												options.onErrored({
/******/ 													type: "accept-errored",
/******/ 													moduleId: outdatedModuleId,
/******/ 													dependencyId: dependenciesForCallbacks[k],
/******/ 													error: err
/******/ 												});
/******/ 											}
/******/ 											if (!options.ignoreErrored) {
/******/ 												reportError(err);
/******/ 											}
/******/ 										}
/******/ 									}
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// Load self accepted modules
/******/ 					for (var o = 0; o < outdatedSelfAcceptedModules.length; o++) {
/******/ 						var item = outdatedSelfAcceptedModules[o];
/******/ 						var moduleId = item.module;
/******/ 						try {
/******/ 							item.require(moduleId);
/******/ 						} catch (err) {
/******/ 							if (typeof item.errorHandler === "function") {
/******/ 								try {
/******/ 									item.errorHandler(err, {
/******/ 										moduleId: moduleId,
/******/ 										module: __webpack_require__.c[moduleId]
/******/ 									});
/******/ 								} catch (err2) {
/******/ 									if (options.onErrored) {
/******/ 										options.onErrored({
/******/ 											type: "self-accept-error-handler-errored",
/******/ 											moduleId: moduleId,
/******/ 											error: err2,
/******/ 											originalError: err
/******/ 										});
/******/ 									}
/******/ 									if (!options.ignoreErrored) {
/******/ 										reportError(err2);
/******/ 										reportError(err);
/******/ 									}
/******/ 								}
/******/ 							} else {
/******/ 								if (options.onErrored) {
/******/ 									options.onErrored({
/******/ 										type: "self-accept-errored",
/******/ 										moduleId: moduleId,
/******/ 										error: err
/******/ 									});
/******/ 								}
/******/ 								if (!options.ignoreErrored) {
/******/ 									reportError(err);
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					return outdatedModules;
/******/ 				}
/******/ 			};
/******/ 		}
/******/ 		__webpack_require__.hmrI.importScripts = function (moduleId, applyHandlers) {
/******/ 			if (!currentUpdate) {
/******/ 				currentUpdate = {};
/******/ 				currentUpdateRuntime = [];
/******/ 				currentUpdateRemovedChunks = [];
/******/ 				applyHandlers.push(applyHandler);
/******/ 			}
/******/ 			if (!__webpack_require__.o(currentUpdate, moduleId)) {
/******/ 				currentUpdate[moduleId] = __webpack_require__.m[moduleId];
/******/ 			}
/******/ 		};
/******/ 		__webpack_require__.hmrC.importScripts = function (
/******/ 			chunkIds,
/******/ 			removedChunks,
/******/ 			removedModules,
/******/ 			promises,
/******/ 			applyHandlers,
/******/ 			updatedModulesList
/******/ 		) {
/******/ 			applyHandlers.push(applyHandler);
/******/ 			currentUpdateChunks = {};
/******/ 			currentUpdateRemovedChunks = removedChunks;
/******/ 			currentUpdate = removedModules.reduce(function (obj, key) {
/******/ 				obj[key] = false;
/******/ 				return obj;
/******/ 			}, {});
/******/ 			currentUpdateRuntime = [];
/******/ 			chunkIds.forEach(function (chunkId) {
/******/ 				if (
/******/ 					__webpack_require__.o(installedChunks, chunkId) &&
/******/ 					installedChunks[chunkId] !== undefined
/******/ 				) {
/******/ 					promises.push(loadUpdateChunk(chunkId, updatedModulesList));
/******/ 					currentUpdateChunks[chunkId] = true;
/******/ 				} else {
/******/ 					currentUpdateChunks[chunkId] = false;
/******/ 				}
/******/ 			});
/******/ 			if (__webpack_require__.f) {
/******/ 				__webpack_require__.f.importScriptsHmr = function (chunkId, promises) {
/******/ 					if (
/******/ 						currentUpdateChunks &&
/******/ 						__webpack_require__.o(currentUpdateChunks, chunkId) &&
/******/ 						!currentUpdateChunks[chunkId]
/******/ 					) {
/******/ 						promises.push(loadUpdateChunk(chunkId));
/******/ 						currentUpdateChunks[chunkId] = true;
/******/ 					}
/******/ 				};
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.hmrM = function() {
/******/ 			if (typeof fetch === "undefined") throw new Error("No browser support: need fetch API");
/******/ 			return fetch(__webpack_require__.p + __webpack_require__.hmrF()).then(function(response) {
/******/ 				if(response.status === 404) return; // no update available
/******/ 				if(!response.ok) throw new Error("Failed to fetch update manifest " + response.statusText);
/******/ 				return response.json();
/******/ 			});
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// module cache are used so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	var __webpack_exports__ = __webpack_require__("(app-pages-browser)/./src/workers/web-worker.ts");
/******/ 	_N_E = __webpack_exports__;
/******/ 	
/******/ })()
;