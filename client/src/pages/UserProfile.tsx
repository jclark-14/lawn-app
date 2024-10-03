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
  PlusCircle,
} from 'lucide-react';
import { ConfirmDeleteModal } from '../components/Modals';

export function UserProfile() {
  // State management for user plans and UI controls
  const { user, token } = useUser();
  const [plans, setPlans] = useState<UserPlan[]>([]);
  const [expandedPlans, setExpandedPlans] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<UserPlan | null>(null);

  // Function to fetch user plans from the API
  const fetchUserPlans = async () => {
    if (!user || !token) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/users/${user.userId}/plans`, {
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
    } catch (err) {
      setError('Error fetching plans. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Use effect to fetch plans when component mounts or user/token changes
  useEffect(() => {
    fetchUserPlans();
  }, [user, token]);

  // Function to sort steps by stepOrder
  const sortSteps = (steps: PlanStep[]): PlanStep[] => {
    return [...steps].sort(
      (a, b) => (a.stepOrder ?? Infinity) - (b.stepOrder ?? Infinity)
    );
  };

  // Function to initiate plan deletion
  const initiatePlanDeletion = (plan: UserPlan) => {
    setPlanToDelete(plan);
    setIsDeleteModalOpen(true);
  };

  // Function to confirm and execute plan deletion
  const confirmDeletePlan = async () => {
    if (!planToDelete) return;

    try {
      const response = await fetch(`/api/plans/${planToDelete.userPlanId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to delete plan');
      setPlans(
        plans.filter((plan) => plan.userPlanId !== planToDelete.userPlanId)
      );
      setIsDeleteModalOpen(false);
      setPlanToDelete(null);
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
    } catch (err) {
      setError('Error updating step. Please try again.');
    }
  };

  // Function that handles the complete plan option
  const handleCompletePlan = async (planId: number) => {
    if (!token) return;

    try {
      const completedAt = new Date().toISOString();
      const response = await fetch(`/api/plans/${planId}/complete`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ completedAt }),
      });
      if (!response.ok) throw new Error('Failed to complete plan');

      setPlans(
        plans.map((plan) =>
          plan.userPlanId === planId
            ? {
                ...plan,
                isCompleted: true,
                completedAt,
                steps: plan.steps.map((step) => ({
                  ...step,
                  completed: true,
                  completedAt: step.completedAt || completedAt,
                })),
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

  // Render loading state
  if (loading) return <div className="text-center py-12">Loading...</div>;
  // Render error state
  if (error)
    return <div className="text-center py-12 text-red-600">{error}</div>;

  // Render the main UserProfile component
  return (
    <div className="py-8 sm:py-12 min-h-screen w-full">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <NavButtons />
        <PlansList
          plans={plans}
          expandedPlans={expandedPlans}
          togglePlanExpansion={togglePlanExpansion}
          initiatePlanDeletion={initiatePlanDeletion}
          handleCompletePlan={handleCompletePlan}
          handleCompleteStep={handleCompleteStep}
          navigate={navigate}
        />
      </div>
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeletePlan}
        itemName={planToDelete?.grassSpeciesName || ''}
        itemType="plan"
      />
    </div>
  );
}

function NavButtons() {
  return (
    <div className="flex justify-between items-center mb-6 sm:mb-10">
      <div className="">
        <Link
          to="/"
          className="bg-gray-100 text-teal-800 px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-lg font-semibold transition duration-300 shadow-md hover:shadow-xl flex items-center hover:bg-gradient-to-r from-slate-600 to-teal-600 hover:text-white hover:border-teal-600">
          <ArrowLeft size={20} className="mr-1 sm:mr-2" />
          Back to Home
        </Link>
      </div>
      <div className="">
        <Link
          to="/new-plan"
          className="bg-gray-100 text-teal-800 px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-lg font-semibold transition duration-300 shadow-md hover:shadow-xl flex items-center hover:bg-gradient-to-r from-slate-600 to-teal-600 hover:text-white hover:border-teal-600">
          <PlusCircle size={20} className="mr-1 sm:mr-2" />
          Generate New Plan
        </Link>
      </div>
    </div>
  );
}

function PlansList({
  plans,
  expandedPlans,
  togglePlanExpansion,
  initiatePlanDeletion,
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
              togglePlanExpansion={togglePlanExpansion}
              initiatePlanDeletion={initiatePlanDeletion}
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
  togglePlanExpansion,
  initiatePlanDeletion,
  handleCompletePlan,
  handleCompleteStep,
  navigate,
}) {
  const allStepsCompleted = plan.steps.every((step) => step.completed);

  return (
    <div className="bg-gray-100 rounded-lg shadow-md overflow-hidden">
      <div className="p-4 sm:p-6">
        <PlanHeader
          plan={plan}
          initiatePlanDeletion={initiatePlanDeletion}
          navigate={navigate}
        />
        <PlanStatus plan={plan} />
        {!plan.isCompleted && !allStepsCompleted && (
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
        <PlanDetails plan={plan} handleCompleteStep={handleCompleteStep} />
      )}
    </div>
  );
}

function PlanHeader({ plan, initiatePlanDeletion, navigate }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
      <h4 className="text-lg sm:text-xl font-semibold text-teal-800 mb-2 sm:mb-0">
        {plan.grassSpeciesName} Plan
      </h4>
      <div className="flex space-x-2 w-full sm:w-auto">
        <button
          onClick={() => navigate(`/plan/${plan.userPlanId}`)}
          className="bg-teal-700 text-white px-3 py-1 rounded-full text-sm font-semibold transition duration-300 hover:bg-gradient-to-r from-slate-600 to-teal-600 flex items-center flex-1 sm:flex-initial justify-center sm:justify-start">
          <Edit size={16} className="mr-1" /> Edit
        </button>
        <button
          onClick={() => initiatePlanDeletion(plan)}
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
function PlanDetails({ plan, handleCompleteStep }) {
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [expandedSteps, setExpandedSteps] = useState<number[]>([]);

  const toggleCheckboxes = () => {
    setShowCheckboxes(!showCheckboxes);
    if (showCheckboxes) {
      setExpandedSteps([]);
    }
  };

  const toggleStepExpansion = (stepId: number) => {
    setExpandedSteps((prev) =>
      prev.includes(stepId)
        ? prev.filter((id) => id !== stepId)
        : [...prev, stepId]
    );
  };

  return (
    <div className="px-4 sm:px-6 pb-4 sm:pb-6">
      <div className="flex justify-between items-center my-2">
        <h5 className="font-semibold text-teal-700 text-sm sm:text-base">
          Steps:
        </h5>
        <button
          onClick={toggleCheckboxes}
          className="sm:hidden text-sm font-semibold text-teal-800 text-right w-1/4">
          {showCheckboxes ? 'Done' : 'Completed Status:'}
        </button>
      </div>
      <ul className="space-y-4 sm:space-y-2">
        {plan.steps.map((step: PlanStep) => (
          <StepItem
            key={step.planStepId}
            step={step}
            planId={plan.userPlanId}
            handleCompleteStep={handleCompleteStep}
            showCheckbox={showCheckboxes}
            isExpanded={expandedSteps.includes(step.planStepId)}
            toggleExpand={() => toggleStepExpansion(step.planStepId)}
          />
        ))}
      </ul>
    </div>
  );
}

function StepItem({
  step,
  planId,
  handleCompleteStep,
  showCheckbox,
  isExpanded,
  toggleExpand,
}) {
  const handleStepCompletion = () => {
    handleCompleteStep(planId, step.planStepId);
  };

  return (
    <li className="flex flex-col">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center flex-1 mr-2">
          <span
            className={`text-gray-700 text-sm sm:text-base ${
              step.completed ? 'line-through' : ''
            }`}>
            {step.stepDescription}
          </span>
        </div>
        <div className="flex items-center">
          {/* Desktop checkbox - always visible */}
          <input
            type="checkbox"
            checked={step.completed}
            onChange={handleStepCompletion}
            className="hidden sm:inline-block form-checkbox h-5 w-5 rounded-lg accent-teal-700 hover:ring-1 hover:cursor-pointer mr-2"
          />
          {/* Mobile checkbox - toggleable */}
          {showCheckbox && (
            <input
              type="checkbox"
              checked={step.completed}
              onChange={handleStepCompletion}
              className="sm:hidden form-checkbox h-5 w-5 rounded-lg accent-teal-700 hover:ring-1 hover:cursor-pointer mr-2"
            />
          )}
          {!showCheckbox && (
            <button
              onClick={toggleExpand}
              className="text-teal-700 hover:text-teal-600 sm:hidden">
              {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          )}
        </div>
      </div>
      {/* Desktop view for completion date */}
      {step.completed && step.completedAt && (
        <div className="mt-2 ml-4 text-xs sm:text-sm font-semibold text-teal-800 hidden sm:block">
          Completed on: {new Date(step.completedAt).toLocaleDateString()}
        </div>
      )}
      {/* Mobile view for completion date or not completed status */}
      {isExpanded && (
        <div className="mt-2 ml-4 text-xs font-semibold text-teal-800 sm:hidden">
          {step.completed && step.completedAt
            ? `Completed on: ${new Date(step.completedAt).toLocaleDateString()}`
            : 'Not completed yet'}
        </div>
      )}
    </li>
  );
}
