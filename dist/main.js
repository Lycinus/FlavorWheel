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

eval("function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }\n\n// import './table.js';\nvar width = 700;\nvar height = 750;\nvar radius = width / 6;\nvar arc = d3.arc().startAngle(function (d) {\n  return d.x0;\n}).endAngle(function (d) {\n  return d.x1;\n}).padAngle(function (d) {\n  return Math.min((d.x1 - d.x0) / 2, 0.005);\n}).padRadius(radius * 1.5).innerRadius(function (d) {\n  return d.y0 * radius;\n}).outerRadius(function (d) {\n  return 1.2 * Math.max(d.y0 * radius, d.y1 * radius - 1);\n});\n\nvar partition = function partition(data) {\n  var root = d3.hierarchy(data).sum(function (d) {\n    return d.size;\n  }).sort(function (a, b) {\n    return b.value - a.value;\n  });\n  return d3.partition().size([2 * Math.PI, root.height + 1])(root);\n};\n\nvar recipe = {};\nd3.json('data.json').then(function (data) {\n  var root = partition(data);\n  var color = d3.scaleOrdinal(d3.schemeCategory10);\n  root.each(function (d) {\n    return d.current = d;\n  });\n  var svg = d3.select('svg').style('width', width).style('height', height).style('font-family', 'Helvetica').style('font-size', '15px');\n  var g = svg.append('g').attr('transform', \"translate(350, 300)\");\n  var path = g.append('g').selectAll('path').data(root.descendants().slice(1)).join('path').attr('fill', function (d) {\n    return color((d.children ? d : d.parent).data.name);\n  }).attr('fill-opacity', function (d) {\n    return arcVisible(d.current) ? d.children ? 0.6 : 0.4 : 0;\n  }).attr('d', function (d) {\n    return arc(d.current);\n  });\n  path.filter(function (d) {\n    return d.children;\n  }).style('cursor', 'pointer').on('click', handleClick).on('mouseover', mouseOver).on('mouseout', mouseOut);\n  var label = g.append('g').attr('pointer-events', 'none').attr('text-anchor', 'middle').style('user-select', 'none').selectAll('text').data(root.descendants().slice(1)).join('text').attr('dy', '0.35em').attr('fill-opacity', function (d) {\n    return +labelVisible(d.current);\n  }).attr('transform', function (d) {\n    return labelTransform(d.current);\n  }).text(function (d) {\n    return d.data.name;\n  });\n  var parent = g.append('circle').datum(root).attr('r', radius).attr('fill', 'none').attr('pointer-events', 'all').on('click', handleClick);\n\n  function addToTable(item, depth) {\n    var table = d3.select('table');\n\n    switch (depth) {\n      case 1:\n        table.select('.continent-row').text(item);\n\n      case 2:\n        table.select('.cuisine-row').text(item);\n\n      case 3:\n        table.select('.protein-row').text(item);\n\n      case 4:\n        table.select('.vegetable-row').text(item);\n    }\n  }\n\n  function handleClick(p) {\n    // Update recipe with new item or remove last item\n    if (recipe[p.depth + 1]) {\n      // Remove text from appropriate table row\n      d3.select(\".ingredient-\".concat(p.depth + 1, \"-row\")).text(''); // Delete item from recipe object\n\n      delete recipe[p.depth + 1]; // Remove section from instructions\n\n      d3.select('.ingredients').selectAll('p').data(Object.values(recipe)).exit().remove();\n    } else if (p.depth !== 0) {\n      // Add text to appropriate table row\n      d3.select(\".ingredient-\".concat(p.depth, \"-row\")).datum(p.data).text(function (d) {\n        return d.name;\n      }); // Add item to recipe object\n\n      recipe[p.depth] = _defineProperty({}, p.depth, p.data.name); // Add section to instructions\n\n      d3.select('.ingredients').selectAll('p').data(Object.values(recipe)).enter().append('p').text(function (d) {\n        return handleRecipeCreate(d);\n      });\n    } // Set root data for the middle circle\n\n\n    parent.datum(p.parent || root); // Sets the end position for the transition\n\n    root.each(function (d) {\n      return d.target = {\n        x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,\n        x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,\n        y0: Math.max(0, d.y0 - p.depth),\n        y1: Math.max(0, d.y1 - p.depth)\n      };\n    }); // Sets the length of the transition\n\n    var t = g.transition().duration(500); // Executes the transition, interpolating between the closest hidden ring \n    // and changing the fill-opacity of that ring (to make it visible) and the \n    // current ring (to make it invisible)\n\n    path.transition(t).tween('data', function (d) {\n      var i = d3.interpolate(d.current, d.target);\n      return function (t) {\n        return d.current = i(t);\n      };\n    }).filter(function (d) {\n      return +this.getAttribute('fill-opacity') || arcVisible(d.target);\n    }).attr('fill-opacity', function (d) {\n      return arcVisible(d.target) ? 0.6 : 0;\n    }).attr('stroke', this.getAttribute('stroke') ? 'none' : null).attrTween('d', function (d) {\n      return function () {\n        return arc(d.current);\n      };\n    }); // Excecutes the same transition for the labels\n\n    label.filter(function (d) {\n      return +this.getAttribute('fill-opacity') || labelVisible(d.target);\n    }).transition(t).attr('fill-opacity', function (d) {\n      return +labelVisible(d.target);\n    }).attrTween('transform', function (d) {\n      return function () {\n        return labelTransform(d.current);\n      };\n    });\n  } // Adds a border to the arcs on mouseover\n\n\n  function mouseOver(d, i, n) {\n    if (this.getAttribute('fill-opacity') > 0) {\n      d3.select(n[i]).transition().attr('stroke', this.getAttribute('fill')).attr('stroke-opacity', .8);\n    }\n  } // Removes border from the arcs on mouseout (currently buggy)\n\n\n  function mouseOut(d, i, n) {\n    if (this.getAttribute('fill-opacity') > 0) {\n      d3.select(n[i]).transition().attr('stroke', 'white');\n    }\n  }\n\n  function arcVisible(d) {\n    return d.y1 <= 2 && d.y0 >= 1 && d.x1 > d.x0;\n  }\n\n  function labelVisible(d) {\n    return d.y1 <= 2 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;\n  }\n\n  function labelTransform(d) {\n    var x = (d.x0 + d.x1) / 2 * 180 / Math.PI;\n    var y = (d.y0 + d.y1) / 2 * radius;\n    return \"rotate(\".concat(x - 90, \") translate(\").concat(y, \",0) rotate(\").concat(x < 180 ? 0 : 180, \")\");\n  }\n\n  function handleRecipeCreate(d) {\n    var depth = Math.max(Object.keys(d));\n    var element = d[depth];\n\n    switch (Math.max(Object.keys(d))) {\n      case 1:\n        if (element === 'Americas') {\n          return \"Let's cook some food using items from the Americas.\";\n        } else {\n          return \"Let's cook some food using items from \".concat(element, \".\");\n        }\n\n        ;\n\n      case 2:\n        return \"Awesome, let's focus on the flavors of \".concat(element, \".\");\n\n      case 3:\n        if (element === 'none') {\n          return 'Who needs meat anyway? Pick a vegetable to be the star of this dish.';\n        } else {\n          return \"Pick a vegetable to go with that \".concat(element, \".\");\n        }\n\n        ;\n\n      case 4:\n        return \"\".concat(element[0].toUpperCase() + element.slice(1), \" - good choice. Here are some herbs and spices that will go well with your items.\");\n    }\n  }\n});\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ })

/******/ });