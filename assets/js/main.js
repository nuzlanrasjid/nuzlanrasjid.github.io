document.addEventListener('DOMContentLoaded', function () {
  var svgNS = 'http://www.w3.org/2000/svg';
  var plotGroup = document.getElementById('plot-points');
  var tooltip = document.getElementById('plot-tooltip');
  var plotWrapper = document.querySelector('.hero__plot');
  var cards = document.querySelectorAll('.project-card');

  if (!plotGroup || cards.length === 0) return;

  // Area plot (mengikuti viewBox svg: x 60-500, y 20-370, sumbu y dibalik)
  var xMin = 60, xMax = 500, yMin = 20, yMax = 370;

  var points = Array.prototype.map.call(cards, function (card) {
    var x = parseFloat(card.dataset.x);
    var y = parseFloat(card.dataset.y);
    return {
      x: isNaN(x) ? (Math.random() * 6 - 3) : x,
      y: isNaN(y) ? (Math.random() * 4) : y,
      title: card.dataset.title,
      id: card.id
    };
  });

  var xVals = points.map(function (p) { return p.x; });
  var yVals = points.map(function (p) { return p.y; });
  var xLo = Math.min.apply(null, xVals) - 1, xHi = Math.max.apply(null, xVals) + 1;
  var yLo = 0, yHi = Math.max.apply(null, yVals) + 1;

  function scaleX(v) { return xMin + ((v - xLo) / (xHi - xLo)) * (xMax - xMin); }
  function scaleY(v) { return yMax - ((v - yLo) / (yHi - yLo)) * (yMax - yMin); }

  points.forEach(function (p) {
    var cx = scaleX(p.x);
    var cy = scaleY(p.y);
    var significant = p.y >= (yHi * 0.55); // di atas "ambang layak dilirik"

    var circle = document.createElementNS(svgNS, 'circle');
    circle.setAttribute('cx', cx);
    circle.setAttribute('cy', cy);
    circle.setAttribute('r', significant ? 9 : 6);
    circle.setAttribute('fill', significant
      ? (p.x >= 0 ? 'var(--accent-up)' : 'var(--accent-down)')
      : 'var(--muted-dot)');
    circle.classList.add('dot');
    circle.setAttribute('tabindex', '0');
    circle.setAttribute('role', 'button');
    circle.setAttribute('aria-label', p.title);

    function show(evt) {
      tooltip.textContent = p.title;
      tooltip.hidden = false;
      var rect = plotWrapper.getBoundingClientRect();
      var svgRect = document.getElementById('volcano-plot').getBoundingClientRect();
      var scaleFactor = svgRect.width / 520;
      tooltip.style.left = (svgRect.left - rect.left + cx * scaleFactor) + 'px';
      tooltip.style.top = (svgRect.top - rect.top + cy * scaleFactor) + 'px';
    }
    function hide() { tooltip.hidden = true; }
    function goTo() {
      var target = document.getElementById(p.id);
      if (!target) return;
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      target.classList.add('project-card--flash');
      setTimeout(function () { target.classList.remove('project-card--flash'); }, 900);
    }

    circle.addEventListener('mouseenter', show);
    circle.addEventListener('mouseleave', hide);
    circle.addEventListener('click', goTo);
    circle.addEventListener('keypress', function (e) {
      if (e.key === 'Enter' || e.key === ' ') goTo();
    });

    plotGroup.appendChild(circle);
  });
});
