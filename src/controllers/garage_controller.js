import { Controller } from '@hotwired/stimulus';

const GARAGE = 'sucata';

export default class extends Controller {
  static targets = ['dataField', 'carsList', 'form']; // this.dataFieldTargets //=> array!

  insertCar(car) {
    const html = `<div class="car">

                  <div class="car-image">
                    <img src="http://loremflickr.com/280/280/${car.brand}${car.model}" />
                  </div>

                  <div class="car-info flex-grow-1">
                    <h4>${car.brand} ${car.model}</h4>
                    <p><strong>Owner:</strong> ${car.owner}</p>
                    <p><strong>Plate:</strong> ${car.plate}</p>
                  </div>

                  <button data-id="${car.id}" class="btn btn-outline-danger align-self-center me-4" data-action="click->garage#deleteCar">
                    <i class="bi bi-trash3"></i>
                  </button>
                </div>`;
    this.carsListTarget.insertAdjacentHTML('afterbegin', html);
  }

  insertCars(data) {
    data.forEach((car) => {
      this.insertCar(car);
    });
  }

  connect() {
    // buscar todos os carros da API
    fetch(`https://wagon-garage-api.herokuapp.com/${GARAGE}/cars`)
      .then((response) => response.json())
      .then((data) => this.insertCars(data));
  }

  deleteCar(event) {
    const id = event.target.dataset.id;

    fetch(`https://wagon-garage-api.herokuapp.com/cars/${id}`, { method: 'DELETE' }).then(() => {
      event.target.parentElement.remove();
    });
  }

  createCar(event) {
    event.preventDefault();
    // event.currentTarget.reset();

    const formData = {};

    this.dataFieldTargets.forEach((field) => {
      formData[field.name] = field.value;
    });

    this.formTarget.reset();

    fetch(`https://wagon-garage-api.herokuapp.com/${GARAGE}/cars`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((car) => this.insertCar(car));
  }
}
