// Express Initialisation
const express = require("express");
const application = express();
const port = process.env.PORT || 8080;

// Sequelize Initialisation
const sequelize = require("./sequelize");

// Import created models
const University = require("./models/university");
const Student = require("./models/student");
const { noExtendRight } = require("sequelize/dist/lib/operators");

// Define entities relationship
University.hasMany(Student);

// Express middleware
application.use(
  express.urlencoded({
    extended: true,
  })
);
application.use(express.json());

// Kickstart the Express aplication
application.listen(port, () => {
  console.log(`The server is running on http://localhost: ${port}.`);
});

// Create a middleware to handle 500 status errors.
application.use((error, request, response, next) => {
  console.error(`[ERROR]: ${error}`);
  response.status(500).json(error);
});

/**
 * Create a special GET endpoint so that when it is called it will
 * sync our database with the models.
 */
 application.put("/", async (request, response, next) => {
  try {
    await sequelize.sync({force: true});
    response.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

/**
 * GET all the universities from the database.
 */
 application.get("/universities", async (request, response, next) => {
  try {
    const universities = await University.findAll();
    if (universities.length > 0) {
      response.json(universities);
    } else {
      response.sendStatus(204);
    }
  } catch (error) {
    next(error);
  }
});

/**
 * POST a new university to the database.
 */
 application.post("/universities", async (request, response, next) => {
  try {
    const university = await University.create(request.body);
    response.status(201).location(university.id).send();
  } catch (error) {
    next(error);
  }
});

/**
 * GET a specific university's students.
 */
 application.get("/universities/:universityId/students", async (request, response, next) => {
  try {
    const university = await University.findByPk(request.params.universityId);
    if (university) {
      const students = await university.getStudents();
      if (students.length > 0) {
        response.json(students);
      } else {
        response.sendStatus(204);
      }
      
    } else {
      response.sendStatus(404);
    }
  } catch (error) {
    next(error);
  }
});

/**
 * POST a new student into a university.
 */
 application.post("/universities/:universityId/students", async (request, response, next) => {
  try {
    const university = await University.findByPk(request.params.universityId);
    if (university) {
      const student = await Student.create(request.body);
      university.addStudent(student);
      await university.save();
      response.status(201).location(student.id).send();
    } else {
      response.sendStatus(404);
    }
  } catch (error) {
    next(error);
  }
});

/**
 * GET a student by id from a university by id.
 */
 application.get('/universities/:universityId/students/:studentId', async (request, response, next) => {
  try {
    const university = await University.findByPk(request.params.universityId)
    if (university) {
      const students = await university.getStudents({id: request.params.studentId});
      const student = students.shift();
      if (student) {
        request.json(student);
      } else {
        response.sendStatus(404);
      }
    } else {
      response.sendStatus(404);
    }
  } catch (error) {
    next(error);
  }
});

/**
 * PUT to update a student from a university.
 */
application.put('/universities/:universityId/students/:studentId', async (request, response, next) => {
  try {
    const university = await University.findByPk(request.params.universityId);
    if (university) {
      const students = await university.getStudents({id: request.params.studentId});
      const student = students.shift();
      if (student) {
        await student.update(request.body);
        response.status(204);
      } else {
        response.sendStatus(404);
      }
    } else {
      response.sendStatus(404);
    }
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE a student from a university.
 */
application.delete('/universities/:universityId/students/:studentId', async (request, response, next) => {
  try {
    const university = await University.findByPk(request.params.universityId);
    if (university) {
      const students = await university.getStudents({id: request.params.studentId});
      const student = students.shift();
      if (student) {
        await student.destroy();
        response.sendStatus(204);
      } else {
        response.sendStatus(404);
      }
    } else {
      response.sendStatus(404);
    }
  } catch (error) {
    next(error);
  }
});

/**
 * GET the list of courses.
 */
application.get('/universities/:universityId/courses', async (request, response, next) => {
  try {
    const university = await University.findByPk(request.params.universityId);
    if (university) {
      const courses = await university.getCourses();
      if (courses.length > 0) {
        response.json(courses);
      } else {
        response.sendStatus(204);
      }
    } else {
      response.sendStatus(404);
    }
  } catch (error) {
    next(error);
  }
});

/**
 * GET a course by id.
 */
application.get('/university/:universityId/courses/:courseId', async (request, response, next) => {
  try {
    const university = await University.findByPk(request.params.universityId);
    if (university) {
      const courses = await university.getCourses({id: request.params.courseId});
      const course = courses.shift();
      if (course) {
        response.json(course);
      } else {
        response.sendStatus(404);
      }
    } else {
      response.sendStatus(404);
    }
  } catch (error) {
    next(error);
  }
});

/**
 * POST a new course.
 */
application.post('/universities/:universityId/courses', async (request, response, next) => {
  try {
    const university = await University.findByPk(request.params.universityId);
    if (university) {
      const course = await Course.create(request.body);
      university.addCourse(course);
      await university.save();
      response.status(201).location(course.id).send();
    } else {
      response.sendStatus(404);
    }
  } catch (error) {
    next(error);
  }
});

/**
 * PUT to update a course.
 */
application.put('/universities/:universityId/courses/:courseId', async (request, response, next) => {
  try {
    const university = await University.findByPk(request.params.universityId);
    if (university) {
      const courses = await university.getCourses({id: request.params.courseId});
      const course = courses.shift();
      if (course) {
        await course.update(request.body);
        response.sendStatus(204);
      } else {
        response.sendStatus(404);
      }
    } else {
      response.sendStatus(404);
    }
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE a course.
 */
application.delete('/universities/:universityId/courses/:courseId', async (request, response, next) => {
  try {
    const university = await University.findByPk(request.params.universityId);
    if (university) {
      const courses = await university.getCourses({id: request.params.courseId});
      const course = courses.shift();
      if (course) {
        await course.destroy();
        response.sendStatus(204);
      } else {
        response.sendStatus(404);
      }
    } else {
      response.sendStatus(404);
    }
  } catch (error) {
    next(error);
  }
});

