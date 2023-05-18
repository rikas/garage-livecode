import { Controller } from '@hotwired/stimulus';

const GARAGE = 'sucata';

// TO GET CARS
// fetch(`https://wagon-garage-api.herokuapp.com/${GARAGE}/cars`)
// .then((response) => response.json())
// .then((data) => this.insertCars(data));

// TO CREATE
// fetch(`https://wagon-garage-api.herokuapp.com/${GARAGE}/cars`, {
//   method: 'POST',
//   headers: { 'Content-Type': 'application/json' },
//   body: JSON.stringify(formData),
// })

export default class extends Controller {
  // this.brandTarget // this.modelTarget....
  static targets = ['brand', 'model', 'plate', 'owner', 'carsList'];

  connect() {
    this.fetchAllCars();
  }

  fetchAllCars() {
    fetch(`https://wagon-garage-api.herokuapp.com/${GARAGE}/cars`)
      .then((response) => response.json())
      .then((data) => {
        this.carsListTarget.innerHTML = '';
        this.insertCars(data);
      });
  }

  insertCars(data) {
    data.forEach((car) => {
      const carTemplate = `<div class="car">
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

      this.carsListTarget.insertAdjacentHTML('afterbegin', carTemplate);
    });
  }

  // addCar was triggered by <form>
  addCar(event) {
    event.preventDefault();

    const target = event.currentTarget;

    // event.currentTarget // this is the <form> element

    const formData = {
      brand: this.brandTarget.value,
      model: this.modelTarget.value,
      owner: this.ownerTarget.value,
      plate: this.plateTarget.value,
    };

    // change the class of the button to disable and add a loader
    // disable ALL fields

    fetch(`https://wagon-garage-api.herokuapp.com/${GARAGE}/cars`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    }).then(() => {
      // instead of fetching all the cars and re-creating the list
      // we could read the POST reponse (which is a car JSON) and add it
      // to the list instead!
      this.fetchAllCars();
      target.reset();
    });
  }
}
