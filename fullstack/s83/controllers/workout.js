const Workout = require('../models/Workout');

// POST /workouts/addWorkout
module.exports.addWorkout = (req, res) => {
  const newWorkout = new Workout({
    userId: req.user.id,
    name: req.body.name,
    duration: req.body.duration
  });

  return newWorkout
    .save()
    .then((savedWorkout) => res.status(201).send(savedWorkout))
    .catch((err) => {
      console.error('Error in saving the workout: ', err);
      return res.status(500).send({ error: 'Failed to save the workout' });
    });
};

// GET /workouts/getMyWorkouts
module.exports.getMyWorkouts = (req, res) => {
  return Workout.find({ userId: req.user.id })
    .then((workouts) => res.status(200).send({ workouts }))
    .catch((err) => {
      console.error('Error in fetching workouts: ', err);
      return res.status(500).send({ error: 'Failed to fetch workouts' });
    });
};

// PATCH /workouts/updateWorkout/:id
module.exports.updateWorkout = (req, res) => {
  const updates = {};

  // only allow updating name and duration (workoutId must come from params)
  if (typeof req.body.name !== 'undefined') updates.name = req.body.name;
  if (typeof req.body.duration !== 'undefined') updates.duration = req.body.duration;

  return Workout.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    updates,
    { new: true }
  )
    .then((updatedWorkout) => {
      if (!updatedWorkout) {
        return res.status(404).send({ message: 'Workout not found' });
      }

      return res.status(200).send({
        message: 'Workout updated successfully',
        updatedWorkout
      });
    })
    .catch((err) => {
      console.error('Error in updating workout: ', err);
      return res.status(500).send({ error: 'Error in updating workout' });
    });
};

// DELETE /workouts/deleteWorkout/:id
module.exports.deleteWorkout = (req, res) => {
  return Workout.deleteOne({ _id: req.params.id, userId: req.user.id })
    .then((deleteResult) => {
      if (deleteResult.deletedCount === 0) {
        return res.status(404).send({ message: 'Workout not found' });
      }

      return res.status(200).send({ message: 'Workout deleted successfully' });
    })
    .catch((err) => {
      console.error('Error in deleting workout: ', err);
      return res.status(500).send({ error: 'Error in deleting workout' });
    });
};

// PATCH /workouts/completeWorkoutStatus/:id
module.exports.completeWorkoutStatus = (req, res) => {
  return Workout.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    { status: 'completed' },
    { new: true }
  )
    .then((updatedWorkout) => {
      if (!updatedWorkout) {
        return res.status(404).send({ message: 'Workout not found' });
      }

      return res.status(200).send({
        message: 'Workout status updated successfully',
        updatedWorkout
      });
    })
    .catch((err) => {
      console.error('Error in completing workout: ', err);
      return res.status(500).send({ error: 'Error in updating workout status' });
    });
};