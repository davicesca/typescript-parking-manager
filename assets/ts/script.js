// Data
const $ = (query) => document.querySelector(query);
const parkingLotTable = $('#parking-lot');
const defaultValue = `
    <td>Empty</td>
    <td>Empty</td>
    <td>Empty</td>
    <td>Empty</td>
    <td>Empty</td>
`;
// Event Listeners and function calls
parkingLot().render();
$('#register').addEventListener('click', (event) => {
    event.preventDefault();
    const model = $('#model').value;
    const licensePlate = $('#license-plate').value;
    const owner = $('#owner').value;
    if (!model || !licensePlate || !owner) {
        alert('You need to enter all information to register a vehicle!');
        return;
    }
    $('#model').value = '';
    $('#license-plate').value = '';
    $('#owner').value = '';
    parkingLot().addVehicle({ model, licensePlate, owner, date: new Date().toLocaleString() }, true);
});
// Functions
function calcPayment(minutes) {
    return 0.25 * minutes;
}
function parkingLot() {
    function getData() {
        return localStorage.getItem('vehicles') ? JSON.parse(localStorage.getItem('vehicles')) : [];
    }
    function saveData(vehicles) {
        localStorage.setItem('vehicles', JSON.stringify(vehicles));
    }
    function addVehicle(vehicle, willSave) {
        if (parkingLotTable.innerHTML !== '' && !getData().length)
            parkingLotTable.innerHTML = '';
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${vehicle.model}</td>
            <td>${vehicle.licensePlate}</td>
            <td>${vehicle.owner}</td>
            <td>${vehicle.date}</td>
            <td><button class="delete-btn" data-plate=${vehicle.licensePlate}>X</button</td>
        `;
        row.querySelector('.delete-btn').addEventListener('click', function () {
            removeVehicle(this.dataset.plate);
        });
        if (willSave)
            saveData([...getData(), vehicle]);
        parkingLotTable.appendChild(row);
    }
    function removeVehicle(plate) {
        const { licensePlate, date } = getData().find(vehicle => vehicle.licensePlate === plate);
        const time = (new Date().getMinutes() - new Date(date).getMinutes());
        if (!confirm(`The customer was in the parking lot for ${time} minutes, and he needs to pay $${calcPayment(time)}.\nClick ok to confirm the end of the service.`))
            return;
        saveData(getData().filter(vehicle => vehicle.licensePlate !== licensePlate));
        render();
    }
    function render() {
        const vehicles = getData();
        if (vehicles.length) {
            parkingLotTable.innerHTML = '';
            vehicles.forEach(vehicle => addVehicle(vehicle));
        }
        else {
            parkingLotTable.innerHTML = defaultValue;
        }
    }
    return { getData, saveData, addVehicle, removeVehicle, render };
}
