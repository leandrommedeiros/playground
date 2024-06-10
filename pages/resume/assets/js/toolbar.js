function zoomIn() {
  var containers = document.querySelectorAll(".resume-page");
  containers.forEach(function(container) {
    var currentZoom = parseFloat(container.style.zoom) || 1;
    var newZoom = currentZoom + 0.1;
    container.style.zoom = newZoom.toFixed(1);
  });
  document.querySelector("#zoom-value").value = (containers[0].style.zoom * 100).toFixed(0);
}

function zoomOut() {
  var containers = document.querySelectorAll(".resume-page");
  containers.forEach(function(container) {
    var currentZoom = parseFloat(container.style.zoom) || 1;
    var newZoom = currentZoom - 0.1;
    container.style.zoom = newZoom.toFixed(1);
  });
  document.querySelector("#zoom-value").value = (containers[0].style.zoom * 100).toFixed(0);
}

function zoomSetValue(value) {
  var containers = document.querySelectorAll(".resume-page");
  containers.forEach(function(container) {
    container.style.zoom = value / 100;
  });
  document.querySelector("#zoom-value").value = parseInt(value).toFixed(0);
}

function zoomSet(element) {
  zoomSetValue(parseInt(element.value));
}

function printPage() {
  window.print();
}

function toggleEdit() {
  var bodyElement = document.querySelector("body");
  bodyElement.contentEditable = bodyElement.contentEditable !== "true" ? "true" : "inherit";
}
