import Storage from './Storage';

class CalorieTracker {
  constructor() {
    (this._calorieLimit = Storage.getCalorieLimit()),
      (this._totalCalories = Storage.getTotalCalories(0)),
      (this._meals = Storage.getMeals()),
      (this._workouts = Storage.getWorkouts());

    this._displayCalorieLimit();
    this._displayCaloriesTotal();
    this._displayCaloriesConsumed();
    this._displayCaloriesBurned();
    this._displayCaloriesRemaining();
    this._displayCaloriesProgress();

    document.getElementById('limit').value = this._calorieLimit;
  }

  addMeal(meal) {
    this._meals.push(meal);
    this._totalCalories += meal.calories;
    Storage.updateCalories(this._totalCalories);
    Storage.saveMeal(meal);
    this._displayNewMeal(meal);
    this._render();
  }

  removeMeal(id) {
    const index = this._meals.findIndex((meal) => meal.id === id);

    if (index !== -1) {
      const meal = this._meals[index];
      this._meals.splice(index, 1);
      this._totalCalories -= meal.calories;
      Storage.updateCalories(this._totalCalories);
      Storage.removeMeal(id);
      this._render();
    }
  }

  addWorkout(workout) {
    this._workouts.push(workout);
    this._totalCalories -= workout.calories;
    Storage.updateCalories(this._totalCalories);
    Storage.saveWorkout(workout);
    this._displayNewWorkout(workout);
    this._render();
  }

  removeWorkout(id) {
    const index = this._workouts.findIndex((workout) => workout.id === id);

    if (index !== -1) {
      const workout = this._workouts[index];
      this._workouts.splice(index, 1);
      this._totalCalories += workout.calories;
      Storage.updateCalories(this._totalCalories);
      Storage.removeWorkout(id);
      this._render();
    }
  }

  reset() {
    this._totalCalories = 0;
    this._meals = [];
    this._workouts = [];
    Storage.clear();
    this._render();
  }

  setLimit(limit) {
    this._calorieLimit = limit;
    Storage.setCalorieLimit(limit);
    this._displayCalorieLimit();
    this._render();
  }

  loadItems() {
    this._meals.forEach((meal) => this._displayNewMeal(meal));
    this._workouts.forEach((workout) => this._displayNewWorkout(workout));
  }

  _displayCaloriesTotal() {
    const totalCalorieEl = document.getElementById('calories-total');
    totalCalorieEl.textContent = this._totalCalories;
  }

  _displayCalorieLimit() {
    const calorieLimiteEl = document.getElementById('calories-limit');
    calorieLimiteEl.textContent = this._calorieLimit;
  }

  _displayCaloriesConsumed() {
    const caloriesConsumedElement =
      document.getElementById('calories-consumed');

    const consumed = this._meals.reduce(
      (total, meal) => total + meal.calories,
      0
    );
    caloriesConsumedElement.textContent = consumed;
  }

  _displayCaloriesBurned() {
    const caloriesBurnedEl = document.getElementById('calories-burned');

    const burned = this._workouts.reduce((total, workout) => {
      return total + workout.calories;
    }, 0);
    caloriesBurnedEl.textContent = burned;
  }

  _displayCaloriesRemaining() {
    const caloriesRemainingEl = document.getElementById('calories-remaining');
    const caloriesRemaining = this._calorieLimit - this._totalCalories;
    const progressEl = document.getElementById('calorie-progress');

    if (caloriesRemaining <= 0) {
      caloriesRemainingEl.parentElement.parentElement.classList.remove(
        'bg-light'
      );
      caloriesRemainingEl.parentElement.parentElement.classList.add(
        'bg-danger'
      );

      progressEl.classList.remove('bg-success');
      progressEl.classList.add('bg-danger');
    } else {
      caloriesRemainingEl.parentElement.parentElement.classList.remove(
        'bg-danger'
      );
      caloriesRemainingEl.parentElement.parentElement.classList.add('bg-light');
      progressEl.classList.remove('bg-danger');
      progressEl.classList.add('bg-success');
    }

    caloriesRemainingEl.textContent = caloriesRemaining;
  }

  _displayCaloriesProgress() {
    const calorieProgress = document.getElementById('calorie-progress');

    const remaining = (this._totalCalories / this._calorieLimit) * 100;

    const width = Math.min(remaining, 100);

    calorieProgress.style.width = `${width}%`;
  }

  _displayNewMeal(meal) {
    const mealsEl = document.getElementById('meal-items');

    const mealEl = document.createElement('div');
    mealEl.classList.add('card', 'my-2');
    mealEl.setAttribute('data-id', meal.id);

    mealEl.innerHTML = `<div class="card-body">
                        <div class="d-flex align-items-center justify-content-between">
                          <h4 class="mx-1">${meal.name}</h4>
                          <div
                            class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5"
                          >
                            ${meal.calories}
                          </div>
                          <button class="delete btn btn-danger btn-sm mx-2">
                            <i class="fa-solid fa-xmark"></i>
                          </button>
                        </div>
                      </div>
                        `;

    mealsEl.appendChild(mealEl);
  }

  _displayNewWorkout(workout) {
    const workoutsEl = document.getElementById('workout-items');

    const workoutEl = document.createElement('div');
    workoutEl.classList.add('card', 'my-2');
    workoutEl.setAttribute('data-id', workout.id);

    workoutEl.innerHTML = `<div class="card-body">
                        <div class="d-flex align-items-center justify-content-between">
                          <h4 class="mx-1">${workout.name}</h4>
                          <div
                            class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5"
                          >
                            ${workout.calories}
                          </div>
                          <button class="delete btn btn-danger btn-sm mx-2">
                            <i class="fa-solid fa-xmark"></i>
                          </button>
                        </div>
                      </div>
                        `;

    workoutsEl.appendChild(workoutEl);
  }

  _render() {
    this._displayCalorieLimit();
    this._displayCaloriesTotal();
    this._displayCaloriesConsumed();
    this._displayCaloriesBurned();
    this._displayCaloriesProgress();
    this._displayCaloriesRemaining();
  }
}

export default CalorieTracker;
