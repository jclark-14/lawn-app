import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../components/useUser';
import { UserPlan, PlanStep } from '../types';
import {
  ArrowLeft,
  Trash2,
  Edit,
  Check,
  ChevronDown,
  ChevronUp,
  Calendar,
} from 'lucide-react';

export function UserProfile() {
  // State management for user plans and UI controls
  const { user, token } = useUser();
  const [plans, setPlans] = useState<UserPlan[]>([]);
  const [expandedPlans, setExpandedPlans] = useState<number[]>([]);
  const [visibleCompletionDates, setVisibleCompletionDates] = useState<
    number[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch user plans when the component mounts or user changes
  useEffect(() => {
    if (user) {
      fetchUserPlans();
    }
  }, [user]);

  // Function to fetch user plans from the API
  const fetchUserPlans = async () => {
    try {
      const response = await fetch(`/api/users/${user?.userId}/plans`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch plans');
      const data = await response.json();
      // Sort steps for each plan before setting the state
      setPlans(
        data.map((plan: UserPlan) => ({
          ...plan,
          steps: sortSteps(plan.steps),
        }))
      );
      setLoading(false);
    } catch (err) {
      setError('Error fetching plans. Please try again.');
      setLoading(false);
    }
  };

  // Function to sort steps by completion status and due date
  const sortSteps = (steps: PlanStep[]): PlanStep[] => {
    return [...steps].sort((a, b) => {
      if (a.completed === b.completed) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      return a.completed ? 1 : -1;
    });
  };

  // Function to delete a plan
  const handleDeletePlan = async (planId: number) => {
    try {
      const response = await fetch(`/api/plans/${planId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to delete plan');
      setPlans(plans.filter((plan) => plan.userPlanId !== planId));
    } catch (err) {
      setError('Error deleting plan. Please try again.');
    }
  };

  // Function to toggle step completion status
  const handleCompleteStep = async (planId: number, stepId: number) => {
    try {
      const plan = plans.find((p) => p.userPlanId === planId);
      const step = plan?.steps.find((s) => s.planStepId === stepId);

      if (!plan || !step) {
        throw new Error('Plan or step not found');
      }

      const newCompletionStatus = !step.completed;
      const completedAt = newCompletionStatus ? new Date().toISOString() : null;

      const response = await fetch(`/api/plans/${planId}/steps/${stepId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          completed: newCompletionStatus,
          completedAt: completedAt,
        }),
      });

      if (!response.ok) throw new Error('Failed to update step');

      // Update the local state with the new step status
      setPlans(
        plans.map((plan) => {
          if (plan.userPlanId === planId) {
            const updatedSteps = plan.steps.map((step) =>
              step.planStepId === stepId
                ? {
                    ...step,
                    completed: newCompletionStatus,
                    completedAt: completedAt,
                  }
                : step
            );
            return { ...plan, steps: sortSteps(updatedSteps) };
          }
          return plan;
        })
      );

      // Remove the step from visible completion dates if it's marked as incomplete
      if (!newCompletionStatus) {
        setVisibleCompletionDates((prev) => prev.filter((id) => id !== stepId));
      }
    } catch (err) {
      setError('Error updating step. Please try again.');
    }
  };

  // Function to mark an entire plan as completed
  const handleCompletePlan = async (planId: number) => {
    try {
      const response = await fetch(`/api/plans/${planId}/complete`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ completedAt: new Date().toISOString() }),
      });
      if (!response.ok) throw new Error('Failed to complete plan');

      // Update the local state to reflect the completed plan
      setPlans(
        plans.map((plan) =>
          plan.userPlanId === planId
            ? {
                ...plan,
                isCompleted: true,
                completedAt: new Date().toISOString(),
              }
            : plan
        )
      );
    } catch (err) {
      setError('Error completing plan. Please try again.');
    }
  };

  // Function to toggle plan expansion in the UI
  const togglePlanExpansion = (planId: number) => {
    setExpandedPlans((prevExpanded) =>
      prevExpanded.includes(planId)
        ? prevExpanded.filter((id) => id !== planId)
        : [...prevExpanded, planId]
    );
  };

  // Function to toggle visibility of step completion dates
  const toggleCompletionDateVisibility = (stepId: number) => {
    setVisibleCompletionDates((prev) =>
      prev.includes(stepId)
        ? prev.filter((id) => id !== stepId)
        : [...prev, stepId]
    );
  };

  // Render loading state
  if (loading) return <div className="text-center py-12">Loading...</div>;
  // Render error state
  if (error)
    return <div className="text-center py-12 text-red-600">{error}</div>;

  // Render the main component
  return (
    <div className="py-8 sm:py-12 min-h-screen w-full">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <BackButton />
        <PageTitle />
        <PlansList
          plans={plans}
          expandedPlans={expandedPlans}
          visibleCompletionDates={visibleCompletionDates}
          togglePlanExpansion={togglePlanExpansion}
          toggleCompletionDateVisibility={toggleCompletionDateVisibility}
          handleDeletePlan={handleDeletePlan}
          handleCompletePlan={handleCompletePlan}
          handleCompleteStep={handleCompleteStep}
          navigate={navigate}
        />
      </div>
    </div>
  );
}

function BackButton() {
  return (
    <div className="flex justify-between items-center mb-6 sm:mb-10">
      <Link
        to="/"
        className="bg-gray-100 text-emerald-800 px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-lg font-semibold transition duration-300 shadow-md hover:shadow-xl flex items-center hover:bg-gradient-to-r from-slate-600 to-teal-600 hover:text-white hover:border-emerald-600">
        <ArrowLeft size={18} className="mr-1 sm:mr-2" />
        Back to Home
      </Link>
    </div>
  );
}

function PageTitle() {
  return (
    <h2 className="text-2xl sm:text-4xl text-teal-800 font-bold text-center tracking-tight mb-6 sm:mb-10">
      Your Lawn Plans
    </h2>
  );
}

function PlansList({
  plans,
  expandedPlans,
  visibleCompletionDates,
  togglePlanExpansion,
  toggleCompletionDateVisibility,
  handleDeletePlan,
  handleCompletePlan,
  handleCompleteStep,
  navigate,
}) {
  return (
    <div className="bg-teal-900 bg-opacity-60 rounded-lg p-4 sm:p-8">
      <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-gray-50">
        Your Lawn Care Plans
      </h3>
      {plans.length === 0 ? (
        <p className="text-gray-200">
          You don't have any plans yet. Create a new plan to get started!
        </p>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {plans.map((plan) => (
            <PlanCard
              key={plan.userPlanId}
              plan={plan}
              isExpanded={expandedPlans.includes(plan.userPlanId)}
              visibleCompletionDates={visibleCompletionDates}
              togglePlanExpansion={togglePlanExpansion}
              toggleCompletionDateVisibility={toggleCompletionDateVisibility}
              handleDeletePlan={handleDeletePlan}
              handleCompletePlan={handleCompletePlan}
              handleCompleteStep={handleCompleteStep}
              navigate={navigate}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function PlanCard({
  plan,
  isExpanded,
  visibleCompletionDates,
  togglePlanExpansion,
  toggleCompletionDateVisibility,
  handleDeletePlan,
  handleCompletePlan,
  handleCompleteStep,
  navigate,
}) {
  return (
    <div className="bg-gray-100 rounded-lg shadow-md overflow-hidden">
      <div className="p-4 sm:p-6">
        <PlanHeader
          plan={plan}
          handleDeletePlan={handleDeletePlan}
          navigate={navigate}
        />
        <PlanStatus plan={plan} />
        {!plan.isCompleted && (
          <CompletePlanButton
            planId={plan.userPlanId}
            handleCompletePlan={handleCompletePlan}
          />
        )}
        <ToggleDetailsButton
          isExpanded={isExpanded}
          togglePlanExpansion={() => togglePlanExpansion(plan.userPlanId)}
        />
      </div>
      {isExpanded && (
        <PlanDetails
          plan={plan}
          visibleCompletionDates={visibleCompletionDates}
          toggleCompletionDateVisibility={toggleCompletionDateVisibility}
          handleCompleteStep={handleCompleteStep}
        />
      )}
    </div>
  );
}

function PlanHeader({ plan, handleDeletePlan, navigate }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
      <h4 className="text-lg sm:text-xl font-semibold text-emerald-800 mb-2 sm:mb-0">
        {plan.grassSpeciesName} Plan
      </h4>
      <div className="flex space-x-2 w-full sm:w-auto">
        <button
          onClick={() => navigate(`/plan/${plan.userPlanId}`)}
          className="bg-teal-700 text-white px-3 py-1 rounded-full text-sm font-semibold transition duration-300 hover:bg-gradient-to-r from-slate-600 to-teal-600 flex items-center flex-1 sm:flex-initial justify-center sm:justify-start">
          <Edit size={16} className="mr-1" /> Edit
        </button>
        <button
          onClick={() => handleDeletePlan(plan.userPlanId)}
          className="bg-teal-700 text-white px-3 py-1 rounded-full text-sm font-semibold transition duration-300 hover:bg-red-800 flex items-center flex-1 sm:flex-initial justify-center sm:justify-start">
          <Trash2 size={16} className="mr-1" /> Delete
        </button>
      </div>
    </div>
  );
}

function PlanStatus({ plan }) {
  return (
    <p className="text-gray-600 mb-2 text-sm sm:text-base">
      Status: {plan.isCompleted ? 'Completed' : 'In Progress'}
      {plan.isCompleted && plan.completedAt && (
        <span className="ml-2">
          on {new Date(plan.completedAt).toLocaleDateString()}
        </span>
      )}
    </p>
  );
}

function CompletePlanButton({ planId, handleCompletePlan }) {
  return (
    <button
      onClick={() => handleCompletePlan(planId)}
      className="mb-4 bg-teal-700 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-full text-sm font-semibold transition duration-300 hover:bg-gradient-to-r from-slate-600 to-teal-600 flex items-center w-full sm:w-auto justify-center sm:justify-start">
      <Check size={16} className="mr-1" /> Mark Plan as Completed
    </button>
  );
}

// Toggle button to show/hide plan details
function ToggleDetailsButton({ isExpanded, togglePlanExpansion }) {
  return (
    <button
      onClick={togglePlanExpansion}
      className="text-teal-800 hover:text-teal-700 font-medium flex items-center text-sm sm:text-base">
      {isExpanded ? (
        <>
          <ChevronUp size={18} className="mr-1" /> Hide Details
        </>
      ) : (
        <>
          <ChevronDown size={18} className="mr-1" /> Show Details
        </>
      )}
    </button>
  );
}

// Component to display the details of a plan, including its steps
function PlanDetails({
  plan,
  visibleCompletionDates,
  toggleCompletionDateVisibility,
  handleCompleteStep,
}) {
  return (
    <div className="px-4 sm:px-6 pb-4 sm:pb-6">
      <h5 className="font-semibold text-emerald-700 mb-2 text-sm sm:text-base">
        Steps:
      </h5>
      <ul className="space-y-2">
        {plan.steps.map((step: PlanStep) => (
          <StepItem
            key={step.planStepId}
            step={step}
            planId={plan.userPlanId}
            isCompletionDateVisible={visibleCompletionDates.includes(
              step.planStepId
            )}
            toggleCompletionDateVisibility={toggleCompletionDateVisibility}
            handleCompleteStep={handleCompleteStep}
          />
        ))}
      </ul>
    </div>
  );
}

// Component to render an individual step item
function StepItem({
  step,
  planId,
  isCompletionDateVisible,
  toggleCompletionDateVisibility,
  handleCompleteStep,
}) {
  return (
    <li className="flex flex-col">
      <div className="flex items-center justify-between">
        <div className="flex items-center flex-1 mr-2">
          <span
            className={`text-gray-700 text-sm sm:text-base ${
              step.completed ? 'line-through' : ''
            }`}>
            {step.stepDescription}
          </span>
          {/* Button to toggle visibility of completion date */}
          {step.completed && step.completedAt && (
            <button
              onClick={() => toggleCompletionDateVisibility(step.planStepId)}
              className="ml-2 text-teal-600 hover:text-teal-800 transition-colors duration-200">
              <Calendar size={14} />
            </button>
          )}
        </div>
        <div className="flex items-center">
          <label className="mr-2 text-sm sm:text-base">Completed:</label>
          {/* Checkbox to mark step as completed */}
          <input
            type="checkbox"
            checked={step.completed}
            onChange={() => handleCompleteStep(planId, step.planStepId)}
            className="form-checkbox h-5 w-5 rounded-lg accent-gray-500 hover:ring-1 hover:cursor-pointer"
          />
        </div>
      </div>
      {/* Conditionally render completion date */}
      {isCompletionDateVisible && step.completedAt && (
        <div className="mt-1 text-xs sm:text-sm text-gray-600">
          Completed on: {new Date(step.completedAt).toLocaleDateString()}
        </div>
      )}
    </li>
  );
}
