"use client";

import React from "react";

const UserManual: React.FC = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">
          Massimo Fitness Tracker User Manual
        </h1>

        <section className="mb-10">
          <h2 className="text-3xl font-semibold text-gray-700 mb-6">Features</h2>

          {/* Profile Management */}
          <h3 className="text-2xl font-bold text-gray-800 mt-6 mb-4">
            1. Profile Management
          </h3>
          <ul className="list-disc pl-8 text-gray-600 leading-relaxed">
            <li>
              <strong>View Profile:</strong> Click on your avatar or username to
              view your profile details.
            </li>
            <li>
              <strong>Update username or email:</strong> Navigate to the
              "Settings" page and update your details.
            </li>
            <li>
              <strong>Upload Avatar:</strong> Go to "Upload Avatar" to update
              your profile picture.
            </li>
          </ul>

          {/* Workout Plan Management */}
          <h3 className="text-2xl font-bold text-gray-800 mt-6 mb-4">
            2. Workout Plan Management
          </h3>
          <ul className="list-disc pl-8 text-gray-600 leading-relaxed">
            <li>
              <strong>Create Workout Plan:</strong> Answer questions about core
              lifts to generate a personalized plan from LLM. Click "start
              workout" at the bottom to start working out with the current plan,
              or access "strength workout" in the "add workout" section to
              start.
            </li>
            <li>
              <strong>View and Edit:</strong> Access the "view and edit workout" page
              to edit and save plans.
            </li>
          </ul>

          {/* Activity Tracking */}
          <h3 className="text-2xl font-bold text-gray-800 mt-6 mb-4">
            3. Activity Tracking
          </h3>
          <ul className="list-disc pl-8 text-gray-600 leading-relaxed">
            <li>
              <strong>Add Workout:</strong> Log your aerobic or strength
              workouts. Click on the sidebar to add workouts.
            </li>
            <li>
              <strong>View Data:</strong> Navigate to "Query Data" to track
              progress. You can choose from different metrics to visualize your
              progress.
            </li>
            <li>
              <strong>List All Workouts:</strong> Navigate to "list all
              workouts" under "query data" to view all your previous aerobic and
              strength workouts in a listed manner.
            </li>
          </ul>

          {/* Gym Finder */}
          <h3 className="text-2xl font-bold text-gray-800 mt-6 mb-4">
            4. Gym Finder <span className="text-sm text-gray-500">(Under Development)</span>
          </h3>
          <ul className="list-disc pl-8 text-gray-600 leading-relaxed">
            <li>Allow location access to find nearby gyms.</li>
          </ul>

          {/* 3D Form Tracker */}
          <h3 className="text-2xl font-bold text-gray-800 mt-6 mb-4">
            5. 3D Form Tracker <span className="text-sm text-gray-500">(Under Development)</span>
          </h3>
          <ul className="list-disc pl-8 text-gray-600 leading-relaxed">
            <li>Upload workout videos of your own, and we will generate a 3D visualization of you doing the workout, analyzing your movements, comparing them to those of a pro, and giving suggestions given by a smart AI.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-3xl font-semibold text-gray-700 mb-6">
            Troubleshooting
          </h2>
          <ul className="list-disc pl-8 text-gray-600 leading-relaxed">
            <li>Contact support or visit the Help Center for assistance.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-3xl font-semibold text-gray-700 mb-6">
            Logging Out
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Click on "Logout" in the sidebar to log out of your account.
          </p>
        </section>
      </div>
    </div>
  );
};

export default UserManual;

