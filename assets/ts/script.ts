// Data
const $ = (query: string): HTMLInputElement => document.querySelector(query);

interface Vehicle {
    model: string;
    licensePlate: string;
    owner: string;
    date: Date | string;
}

// Event Listeners and function calls
parkingYard().render();

$('#register').addEventListener('click', (event) => {
    event.preventDefault();
    const model = $('#model').value;
    const licensePlate = $('#license-plate').value;
    const owner = $('#owner').value;

    if(!model || !licensePlate || !owner) {
        alert('You need to enter all information to register a vehicle!');
        return;
    }

    $('#model').value = '';
    $('#license-plate').value = '';
    $('#owner').value = '';

    parkingYard().addVehicle({model, licensePlate, owner, date: new Date().toLocaleString()}, true);
});

// Functions
function calcPayment(minutes: number): number {
    return 0.25 * minutes;
}

function parkingYard() {

    function getData(): Vehicle[] {
        return localStorage.getItem('vehicles') ? JSON.parse(localStorage.getItem('vehicles')) : [];
        }

    function saveData(vehicles: Vehicle[]) {
        localStorage.setItem('vehicles', JSON.stringify(vehicles));
    }

    function addVehicle(vehicle: Vehicle, willSave?: boolean) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${vehicle.model}</td>
            <td>${vehicle.licensePlate}</td>
            <td>${vehicle.owner}</td>
            <td>${vehicle.date}</td>
            <td><button class="delete-btn" data-plate=${vehicle.licensePlate}>X</button</td>
        `;

        row.querySelector('.delete-btn').addEventListener('click', function() {
            removeVehicle(this.dataset.plate);
        });

        if (willSave) saveData([...getData(), vehicle]);
        $('#parking-yard').appendChild(row);
    }

    function removeVehicle(plate: string) {
        const {model, licensePlate, date} = getData().find(vehicle => vehicle.licensePlate === plate);

        const time = (new Date().getMinutes() - new Date(date).getMinutes());
        
        if(!confirm(`The customer was in the parking lot for ${time} minutes, and he needs to pay $${calcPayment(time)}.\nClick ok to confirm the end of the service.`)) return;

        saveData(getData().filter(vehicle => vehicle.licensePlate !== licensePlate));
        render();
    }

    function render() {
        $('#parking-yard').innerHTML = '';
        const vehicles = getData();

        if(vehicles.length) {
            vehicles.forEach(vehicle => addVehicle(vehicle));
        }
    }

    return {getData, saveData, addVehicle, removeVehicle, render};
}
