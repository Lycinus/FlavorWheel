/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("var width = 700;\nvar height = 700;\nvar radius = Math.min(width, height) / 2;\nvar color = d3.scaleOrdinal(d3.schemeCategory10);\nvar g = d3.select('svg').attr('width', width).attr('height', height).append('g').attr('transform', \"translate(\".concat(width / 2, \", \").concat(height / 2, \")\"));\nvar partition = d3.partition().size([2 * Math.PI, radius]);\nd3.json(\"data.json\", function (error, nodeData) {\n  if (error) throw error;\n  var root = d3.hierarchy(nodeData) // .sum(function(d) { return d.size })\n  .count().sort(function (a, b) {\n    return b.value - a.value;\n  });\n  partition(root);\n  var arc = d3.arc().startAngle(function (d) {\n    return d.x0;\n  }).endAngle(function (d) {\n    return d.x1;\n  }).innerRadius(function (d) {\n    return d.y0;\n  }).outerRadius(function (d) {\n    return d.y1;\n  });\n  var slice = g.selectAll('g').data(root.descendants()).enter().append('g').attr('class', 'node');\n  slice.append('path').attr('display', function (d) {\n    return d.depth <= 2 ? null : 'none';\n  }).attr('d', arc).style('stroke', '#fff').style('fill', function (d) {\n    return color((d.children ? d : d.parent).data.name);\n  });\n  g.selectAll('.node').append('text').attr('transform', function (d) {\n    return \"translate(\".concat(arc.centroid(d), \")rotate(\").concat(computeTextRotation(d), \")\");\n  }).attr('dx', '-15').attr('dy', '.5em').attr('display', function (d) {\n    return d.depth <= 2 ? null : 'none';\n  }).text(function (d) {\n    return d.parent ? d.data.name : \"\";\n  });\n});\n\nfunction computeTextRotation(d) {\n  var angle = (d.x0 + d.x1) / Math.PI * 90;\n  return angle < 180 ? angle - 90 : angle + 90;\n}\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ })

/******/ });