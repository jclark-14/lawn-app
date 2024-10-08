import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  Edit,
  Check,
  ChevronDown,
  ChevronUp,
  PlusCircle,
  Home,
} from 'lucide-react';
import { ConfirmDeleteModal } from '../components/Modals'; // Modal for confirming deletions
import { UserProfileSkeleton } from '../components/Skeleton'; // Skeleton loader for loading state
import { useFetchUserPlans } from '../hooks/useFetchUserPlans'; // Hook to fetch user's plans
import { useUserPlanActions } from '../hooks/useUserPlanActions.ts'; // Hook for actions on user plans (delete, complete)
import { UserPlan, PlanStep } from '../types';

// Main UserProfile component, displaying user plans and allowing actions like delete and complete
export function UserProfile() {
  const navigate = useNavigate();
  const [expandedPlans, setExpandedPlans] = useState<number[]>([]); // State to track which plans are expanded
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State for controlling delete confirmation modal
  const [planToDelete, setPlanToDelete] = useState<UserPlan | null>(null); // State to store the plan selected for deletion

  const { plans, isLoading, error, refetchPlans } = useFetchUserPlans(); // Hook to fetch plans, loading state, and errors
  const { deletePlan, completePlan, completeSteps } =
    useUserPlanActions(refetchPlans); // Hook to perform actions on plans (delete, complete), and refresh plans after actions

  // Show a skeleton loader while loading
  if (isLoading) return <UserProfileSkeleton />;
  // Show error message if there is an error fetching plans
  if (error)
    return <div className="text-center py-12 text-red-600">{error}</div>;

  // Toggle plan expansion (to show or hide steps)
  const togglePlanExpansion = (planId: number) => {
    setExpandedPlans((prev) =>
      prev.includes(planId)
        ? prev.filter((id) => id !== planId)
        : [...prev, planId]
    );
  };

  // Initiate the process of deleting a plan by opening the delete confirmation modal
  const initiatePlanDeletion = (plan: UserPlan) => {
    setPlanToDelete(plan); // Set the plan to delete
    setIsDeleteModalOpen(true); // Open the delete confirmation modal
  };

  // Confirm and delete the selected plan
  const confirmDeletePlan = async () => {
    if (planToDelete) {
      await deletePlan(planToDelete.userPlanId); // Call the delete plan function
      setIsDeleteModalOpen(false); // Close the delete modal
      setPlanToDelete(null); // Clear the plan to delete state
    }
  };

  return (
    <div className="py-8 sm:py-12 min-h-screen w-full">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <NavButtons /> {/* Render navigation buttons */}
        <PlansList
          plans={plans}
          expandedPlans={expandedPlans}
          togglePlanExpansion={togglePlanExpansion}
          initiatePlanDeletion={initiatePlanDeletion}
          handleCompletePlan={completePlan}
          handleCompleteSteps={completeSteps}
          navigate={navigate}
        />
      </div>
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)} // Close the delete modal
        onConfirm={confirmDeletePlan} // Confirm the deletion of the plan
        itemName={planToDelete?.grassSpeciesName || ''} // Show the name of the plan being deleted
        itemType="plan" // Indicate the type of item (plan) being deleted
      />
    </div>
  );
}

// Navigation buttons for navigating to the home page or adding a new plan
function NavButtons() {
  return (
    <div className="flex justify-between items-center mb-6 sm:mb-10">
      <div>
        <Link
          to="/"
          className="bg-gray-100 text-teal-800 px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-lg font-semibold transition duration-300 shadow-md hover:shadow-xl flex items-center hover:bg-gradient-to-r from-gray-800 to-teal-500 hover:text-white hover:border-teal-500">
          <Home size={20} className="mr-1 sm:mr-2" />
          Home
        </Link>
      </div>
      <Link
        to="/new-plan"
        className="bg-gray-100 text-teal-800 px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-lg font-semibold transition duration-300 shadow-md hover:shadow-xl flex items-center hover:bg-gradient-to-r from-gray-800 to-teal-500 hover:text-white hover:border-teal-500">
        <PlusCircle size={20} className="mr-1 sm:mr-2" />
        Add New Plan
      </Link>
    </div>
  );
}

// Component that renders the list of user plans
function PlansList({
  plans,
  expandedPlans,
  togglePlanExpansion,
  initiatePlanDeletion,
  handleCompletePlan,
  handleCompleteSteps,
  navigate,
}) {
  return (
    <div className="bg-teal-900 bg-opacity-75 rounded-lg p-4 sm:p-8">
      <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-gray-50">
        Your Lawn Care Plans
      </h3>
      {plans.length === 0 ? (
        <p className="text-gray-50">
          You don't have any plans yet. Create a new plan to get started!
        </p>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {plans.map((plan) => (
            <PlanCard
              key={plan.userPlanId}
              plan={plan}
              isExpanded={expandedPlans.includes(plan.userPlanId)} // Check if the plan is expanded
              togglePlanExpansion={togglePlanExpansion}
              initiatePlanDeletion={initiatePlanDeletion}
              handleCompletePlan={handleCompletePlan}
              handleCompleteSteps={handleCompleteSteps}
              navigate={navigate}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Component that renders an individual plan with its details
function PlanCard({
  plan,
  isExpanded,
  togglePlanExpansion,
  initiatePlanDeletion,
  handleCompletePlan,
  handleCompleteSteps,
  navigate,
}) {
  const allStepsCompleted = plan.steps.every((step) => step.completed); // Check if all steps in the plan are completed

  return (
    <div className="bg-gray-100 rounded-lg shadow-md overflow-hidden">
      <div className="p-4 sm:p-6">
        <PlanHeader
          plan={plan}
          initiatePlanDeletion={initiatePlanDeletion}
          navigate={navigate}
        />
        {!plan.isCompleted && !allStepsCompleted && (
          <CompletePlanButton
            planId={plan.userPlanId}
            handleCompletePlan={handleCompletePlan}
          />
        )}
        <PlanStatus plan={plan} />
        <ToggleDetailsButton
          isExpanded={isExpanded}
          togglePlanExpansion={() => togglePlanExpansion(plan.userPlanId)}
        />
      </div>
      {isExpanded && (
        <PlanDetails plan={plan} handleCompleteSteps={handleCompleteSteps} />
      )}
    </div>
  );
}

// Header for each plan showing plan details and action buttons
function PlanHeader({ plan, initiatePlanDeletion, navigate }) {
  const displayTitle = plan.planTitle || `${plan.grassSpeciesName} Plan`; // Fallback to grass species name if plan title is not available

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
      <h4 className="text-lg sm:text-xl font-semibold text-teal-800 mb-2 sm:mb-0">
        {displayTitle}
      </h4>
      <div className="flex space-x-2 w-full sm:w-auto">
        <button
          onClick={() => navigate(`/plan/${plan.userPlanId}`)}
          className="bg-teal-700 text-white px-4 py-2 rounded-full w-full text-sm font-semibold transition duration-300 hover:bg-gradient-to-r from-gray-800 to-teal-500 flex items-center sm:flex-initial justify-center sm:justify-start">
          <Edit size={16} className="mr-1" /> Edit
        </button>
        <button
          onClick={() => initiatePlanDeletion(plan)}
          className="bg-teal-700 text-white px-3 py-1 rounded-full w-full text-sm font-semibold transition duration-300 hover:bg-red-800 flex items-center sm:flex-initial justify-center sm:justify-start">
          <Trash2 size={16} className="mr-1" /> Delete
        </button>
      </div>
    </div>
  );
}

// Component that displays the status of the plan (Completed or In Progress)
function PlanStatus({ plan }) {
  return (
    <p className="text-teal-800 mb-2 text-sm font-semibold sm:text-base">
      Status: {plan.isCompleted ? 'Completed' : 'In Progress'}
      {plan.isCompleted && plan.completedAt && (
        <span className="ml-2">
          on {new Date(plan.completedAt).toLocaleDateString()}{' '}
          {/* Display the completion date */}
        </span>
      )}
    </p>
  );
}

// Button to mark the entire plan as completed
function CompletePlanButton({ planId, handleCompletePlan }) {
  return (
    <div className="flex justify-center sm:justify-start w-full">
      <button
        onClick={() => handleCompletePlan(planId)}
        className="mb-4 bg-teal-700 text-white px-3 sm:px-4 py-2 sm:py-2 w-full justify-center rounded-full text-sm font-semibold transition duration-300 hover:bg-gradient-to-r from-gray-800 to-teal-500 flex items-center sm:w-auto sm:justify-start">
        <Check size={16} className="mr-1" /> Mark Plan as Completed
      </button>
    </div>
  );
}

// Toggle button to show/hide plan details
function ToggleDetailsButton({ isExpanded, togglePlanExpansion }) {
  return (
    <button
      onClick={togglePlanExpansion}
      className="text-teal-800 hover:text-teal-700 font-medium flex items-center text-sm sm:text-sm">
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
interface PlanDetailsProps {
  plan: UserPlan;
  handleCompleteSteps: (planId: number, stepIds: number[]) => void;
}

function PlanDetails({ plan, handleCompleteSteps }: PlanDetailsProps) {
  const [selectedSteps, setSelectedSteps] = useState<number[]>([]); // State to track selected steps for completion
  const [expandedSteps, setExpandedSteps] = useState<number[]>([]); // State to track which steps are expanded

  // Preselect all steps if the plan is completed
  useEffect(() => {
    if (plan.isCompleted) {
      setSelectedSteps(plan.steps.map((step) => step.planStepId)); // Select all steps if the plan is marked completed
    }
  }, [plan.isCompleted, plan.steps]);

  // Toggle step selection (checkbox)
  const toggleStepSelection = (stepId: number) => {
    setSelectedSteps((prev) =>
      prev.includes(stepId)
        ? prev.filter((id) => id !== stepId)
        : [...prev, stepId]
    );
  };

  // Toggle step expansion (to show or hide details)
  const toggleStepExpansion = (stepId: number) => {
    setExpandedSteps((prev) =>
      prev.includes(stepId)
        ? prev.filter((id) => id !== stepId)
        : [...prev, stepId]
    );
  };

  // Mark selected steps as completed
  const handleMarkStepsComplete = () => {
    handleCompleteSteps(plan.userPlanId, selectedSteps); // Complete the selected steps
    setSelectedSteps([]); // Clear the selection after completion
  };

  const hasSelectedUncompletedSteps = selectedSteps.some((stepId) =>
    plan.steps.find((step) => step.planStepId === stepId && !step.completed)
  ); // Check if any selected steps are not yet completed

  return (
    <div className="px-4 sm:px-6 pb-4 sm:pb-6">
      <div className="flex justify-between items-center w-full h-fit">
        <h5 className="font-semibold text-teal-700 text-sm sm:text-base mb-2 text-center">
          Steps:
        </h5>
        {hasSelectedUncompletedSteps && (
          <button
            onClick={handleMarkStepsComplete}
            className="mb-4 bg-teal-700 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-full w-fit text-sm font-semibold transition duration-300 hover:bg-gradient-to-r from-gray-800 to-teal-500 flex items-center sm:w-auto justify-center sm:justify-start">
            <Check size={16} className="mr-1" /> Complete Selected
          </button>
        )}
      </div>
      <ul className="space-y-4 sm:space-y-2">
        {plan.steps.map((step: PlanStep) => (
          <StepItem
            key={step.planStepId}
            step={step}
            isSelected={selectedSteps.includes(step.planStepId)}
            toggleSelection={() => toggleStepSelection(step.planStepId)}
            isExpanded={expandedSteps.includes(step.planStepId)}
            toggleExpand={() => toggleStepExpansion(step.planStepId)}
          />
        ))}
      </ul>
    </div>
  );
}

// Component for displaying an individual step within a plan
interface StepItemProps {
  step: PlanStep;
  isSelected: boolean;
  toggleSelection: () => void;
  isExpanded: boolean;
  toggleExpand: () => void;
}

function StepItem({
  step,
  isSelected,
  toggleSelection,
  isExpanded,
  toggleExpand,
}: StepItemProps) {
  return (
    <li className="flex flex-col">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center flex-1">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={toggleSelection}
            className="form-checkbox h-5 w-5 rounded-lg accent-teal-700 hover:ring-1 hover:cursor-pointer mr-2"
            disabled={step.completed} // Disable the checkbox if the step is already completed
          />
          <span
            className={`text-gray-900 text-sm sm:text-base ${
              step.completed ? 'line-through' : ''
            }`}>
            {step.stepDescription}
          </span>
        </div>
        <div className="flex items-center">
          {step.completed && step.completedAt && (
            <span className="text-xs sm:text-sm font-semibold text-teal-800 mr-2 hidden sm:inline">
              Completed on: {new Date(step.completedAt).toLocaleDateString()}
            </span>
          )}
          <button
            onClick={toggleExpand}
            className="text-teal-700 hover:text-teal-500 sm:hidden">
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
      </div>
      {isExpanded && !step.completed && (
        <div className="mt-2 ml-8 text-xs font-semibold text-teal-800">
          Not completed yet
        </div>
      )}
      {isExpanded && step.completed && step.completedAt && (
        <div className="mt-2 ml-8 text-xs font-semibold text-teal-800">
          Completed on: {new Date(step.completedAt).toLocaleDateString()}
        </div>
      )}
    </li>
  );
}
