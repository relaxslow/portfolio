xs.init = function (module) {
    var rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    rect.setAttributeNS(null, 'width', 30)
    rect.setAttributeNS(null, 'height', 40)
    rect.setAttributeNS(null, 'fill', '#f06')
    module.div.append(rect)
}