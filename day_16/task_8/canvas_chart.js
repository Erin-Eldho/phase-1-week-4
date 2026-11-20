const canvas = document.getElementById("sales-chart");
const context = canvas.getContext("2d");
const tooltip = document.getElementById("chart-tooltip");
const exportButton = document.getElementById("export-chart");

const salesData = [
    { month: "Jan", sales: 12000 },
    { month: "Feb", sales: 15000 },
    { month: "Mar", sales: 18000 },
    { month: "Apr", sales: 14000 },
    { month: "May", sales: 22000 },
    { month: "Jun", sales: 25000 },
    { month: "Jul", sales: 20000 },
    { month: "Aug", sales: 28000 },
    { month: "Sep", sales: 24000 },
    { month: "Oct", sales: 30000 },
    { month: "Nov", sales: 27000 },
    { month: "Dec", sales: 35000 }
];

const maxSales = 40000;
const duration = 2000;

let chartWidth;
let chartHeight;
let progress = 0;
let hoveredIndex = -1;
let animationStart;

const chartArea = {left: 100, right: 20, top: 30, bottom: 65};

function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const pixelRatio = window.devicePixelRatio || 1;
    chartWidth = rect.width;
    chartHeight = rect.height;
    canvas.width = chartWidth * pixelRatio;
    canvas.height = chartHeight * pixelRatio;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    drawChart(progress);
}

function drawChart(animationProgress) {
    context.clearRect(0, 0, chartWidth, chartHeight);
    context.fillStyle = "#FFFFFF";
    context.fillRect(0, 0, chartWidth, chartHeight);
    const plotWidth = chartWidth - chartArea.left - chartArea.right;
    const plotHeight = chartHeight - chartArea.top - chartArea.bottom;
    const baseY = chartArea.top + plotHeight;
    const barSpace = plotWidth / salesData.length;
    const barWidth = barSpace * 0.6;

    // Draw gridlines and Y-axis labels
    context.font = "12px Arial";
    context.textAlign = "right";
    context.textBaseline = "middle";

    for (let value = 0; value <= maxSales; value += 10000) {
        const y = baseY - (value / maxSales) * plotHeight;
        context.beginPath();
        context.strokeStyle = "#E8CDD5";
        context.lineWidth = 1;
        context.moveTo(chartArea.left, y);
        context.lineTo(chartWidth - chartArea.right, y);
        context.stroke();
        context.fillStyle = "#38232C";
        context.fillText(value.toLocaleString("en-IN"), chartArea.left - 10, y);
    }

    // Draw axes
    context.beginPath();
    context.strokeStyle = "#38232C";
    context.lineWidth = 1.5;
    context.moveTo(chartArea.left, chartArea.top);
    context.lineTo(chartArea.left, baseY);
    context.lineTo(chartWidth - chartArea.right, baseY);
    context.stroke();

    // Draw axis titles
    context.fillStyle = "#38232C";
    context.font = "14px Arial";
    context.textAlign = "center";
    context.fillText("Month", chartArea.left + plotWidth / 2, chartHeight - 10);
    context.save();
    context.translate(18, chartArea.top + plotHeight / 2);
    context.rotate(-Math.PI / 2);
    context.fillText("Sales (₹)", 0, 0);
    context.restore();

    // Draw bars and month labels
    salesData.forEach((item, index) => {
        const x = chartArea.left + index * barSpace + (barSpace - barWidth) / 2;
        const barHeight = (item.sales / maxSales) * plotHeight * animationProgress;
        const y = baseY - barHeight;
        const gradient = context.createLinearGradient( 0, y, 0, baseY);

        gradient.addColorStop(0, "#C58A98");
        gradient.addColorStop(1, "#722F45");
        context.fillStyle = gradient;
        context.fillRect(x, y, barWidth, barHeight);

        // Highlight hovered bar
        if (index === hoveredIndex && animationProgress === 1) {
            context.strokeStyle = "#38232C";
            context.lineWidth = 2;
            context.strokeRect(x, y, barWidth, barHeight);
        }

        context.fillStyle = "#38232C";
        context.font = "12px Arial";
        context.textAlign = "center";
        context.textBaseline = "top";
        context.fillText( item.month, x + barWidth / 2, baseY + 10);
    });
}

// Animate bars from zero height
function animateChart(timestamp) {
    if (!animationStart) {
        animationStart = timestamp;
    }
    const elapsed = timestamp - animationStart;
    const linearProgress = Math.min(elapsed / duration, 1);

    // Ease-out cubic
    progress = 1 - Math.pow(1 - linearProgress, 3);
    drawChart(progress);

    if (linearProgress < 1) {
        requestAnimationFrame(animateChart);
    } else {
        progress = 1;
        drawChart(progress);
    }
}

// Detect hovered bar and display tooltip
canvas.addEventListener("mousemove", event => {
    if (progress < 1) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const plotWidth = chartWidth - chartArea.left - chartArea.right;
    const plotHeight = chartHeight - chartArea.top - chartArea.bottom;
    const baseY = chartArea.top + plotHeight;
    const barSpace = plotWidth / salesData.length;
    const barWidth = barSpace * 0.6;

    hoveredIndex = -1;

    salesData.forEach((item, index) => {
        const x = chartArea.left + index * barSpace + (barSpace - barWidth) / 2;
        const barHeight = (item.sales / maxSales) * plotHeight;
        const y = baseY - barHeight;
        if (mouseX >= x && mouseX <= x + barWidth && mouseY >= y && mouseY <= baseY) {
            hoveredIndex = index;
        }
    });

    if (hoveredIndex !== -1) {
        const item = salesData[hoveredIndex];
        tooltip.textContent = `${item.month}: ₹${item.sales.toLocaleString("en-IN")}`;
        tooltip.style.display = "block";
        tooltip.style.left = `${mouseX + 15}px`;
        tooltip.style.top = `${mouseY + 15}px`;
    } else {
        tooltip.style.display = "none";
    }

    drawChart(progress);
});

canvas.addEventListener("mouseleave", () => {
    hoveredIndex = -1;
    tooltip.style.display = "none";
    drawChart(progress);
});

// Export chart as PNG
exportButton.addEventListener("click", () => {
    const imageURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = imageURL;
    link.download = "monthly-sales-chart.png";
    link.click();
});

// Initialize chart
resizeCanvas();
window.addEventListener("resize", resizeCanvas);
requestAnimationFrame(animateChart);
