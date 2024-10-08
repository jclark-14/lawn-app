import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Edit2,
  Save,
  BookmarkPlus,
  PlusSquare,
  User,
  Trash2,
} from 'lucide-react';
import { ConfirmDeleteModal, SavedToProfileModal } from '../components/Modals'; // Reusable modals for confirmation and notifications
import { PlanDetailsSkeleton } from '../components/Skeleton'; // Skeleton component for loading state
import { useFetchPlan } from '../hooks/useFetchPlan'; // Custom hook to fetch plan data
import { useUpdatePlan } from '../hooks/useUpdatePlan'; // Custom hook to update plan
import { useStepManagement } from '../hooks/useStepManagement'; // Custom hook for step-related actions
import { useSavePlanToProfile } from '../hooks/useSavePlanToProfile'; // Custom hook to save plan to profile
import { type PlanStep } from '../types'; // Type for the plan step structure

// Main component to display plan details and allow editing
export function PlanDetails() {
  const { planId } = useParams<{ planId: string }>(); // Get the plan ID from the URL params
  const navigate = useNavigate(); // React Router hook for navigation
  const [isEditing, setIsEditing] = useState(false); // Track whether the user is in editing mode
  const [isEditingTitle, setIsEditingTitle] = useState(false); // Track whether the title is being edited
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false); // Track if the "saved to profile" modal is open

  const { plan, isLoading, error, refetchPlan } = useFetchPlan(planId); // Fetch plan data with loading/error state
  const { updatePlan, isSaving } = useUpdatePlan(planId, refetchPlan); // Hook to handle updating the plan
  const {
    addStep,
    deleteStep,
    updateStep,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    stepToDelete,
    setStepToDelete,
  } = useStepManagement(planId, refetchPlan); // Hooks for managing steps (add, delete, update)
  const { savePlanToProfile } = useSavePlanToProfile(); // Hook for saving the plan to the user's profile

  if (isLoading) return <PlanDetailsSkeleton />;
  if (error)
    return <div className="text-red-500 text-center py-8">{error}</div>;
  if (!plan) return <div className="text-center py-8">No plan found</div>;

  // Toggle between editing and saving plan changes
  const handleEditSave = async () => {
    if (isEditing && plan) {
      await updatePlan(plan); // Save changes if in editing mode
    }
    setIsEditing(!isEditing);
  };

  // Handle saving plan to the user's profile
  const handleSaveToProfile = async () => {
    if (plan) {
      const success = await savePlanToProfile(plan.userPlanId); // Attempt to save plan to profile
      if (success) {
        setIsSavedModalOpen(true); // Show success modal
        await refetchPlan(); // Refetch plan to reflect saved state
      }
    }
  };

  // Handle deleting a step from the plan
  const handleDeleteStep = (stepId: number) => {
    const stepToDelete = plan?.steps.find((step) => step.planStepId === stepId); // Find the step to delete
    if (stepToDelete) {
      setIsDeleteModalOpen(true); // Open confirmation modal
      setStepToDelete(stepToDelete); // Set the step to be deleted
    }
  };
  return (
    <div className="py-6 sm:py-12 w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <PlanCard
          plan={plan}
          isEditing={isEditing}
          isSaving={isSaving}
          isEditingTitle={isEditingTitle}
          setIsEditingTitle={setIsEditingTitle}
          handleEditSave={handleEditSave}
          handleSaveToProfile={handleSaveToProfile}
          handleAddStep={addStep}
          handleStepChange={updateStep}
          handleDeleteStep={handleDeleteStep}
          handleTitleEdit={(newTitle) =>
            updatePlan({ ...plan, planTitle: newTitle })
          }
        />
      </div>
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => deleteStep(stepToDelete?.planStepId)}
        itemName={stepToDelete?.stepDescription || ''}
        itemType="step"
      />
      <SavedToProfileModal
        isOpen={isSavedModalOpen}
        onClose={() => {
          setIsSavedModalOpen(false);
          navigate('/profile');
        }}
      />
    </div>
  );
}

// PlanCard component handles the overall display and editing of the plan
function PlanCard({
  plan,
  isEditing,
  isSaving,
  isEditingTitle,
  setIsEditingTitle,
  handleEditSave,
  handleSaveToProfile,
  handleAddStep,
  handleStepChange,
  handleDeleteStep,
  handleTitleEdit,
}) {
  return (
    <div>
      <NavigationButtons />
      <div className="bg-teal-900 bg-opacity-75 rounded-lg shadow-lg p-4 sm:p-6 mb-8">
        <PlanHeader
          plan={plan}
          isEditing={isEditing}
          isSaving={isSaving}
          isEditingTitle={isEditingTitle}
          setIsEditingTitle={setIsEditingTitle}
          handleEditSave={handleEditSave}
          handleSaveToProfile={handleSaveToProfile}
          handleAddStep={handleAddStep}
          handleTitleEdit={handleTitleEdit}
        />
        <PlanSteps
          steps={plan.steps}
          isEditing={isEditing}
          handleStepChange={handleStepChange}
          handleDeleteStep={handleDeleteStep}
        />
      </div>
    </div>
  );
}

// Navigation buttons for easy access to other pages
function NavigationButtons() {
  return (
    <div className="flex justify-between mb-6 mx-2">
      <Link
        to="/new-plan"
        className="bg-gray-100 text-teal-800 px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-lg font-semibold transition duration-300 shadow-md hover:shadow-xl flex items-center hover:bg-gradient-to-r from-gray-800 to-teal-600 hover:text-white hover:border-teal-600">
        <PlusSquare size={20} className="mr-1 sm:mr-2" />
        New Plan
      </Link>
      <Link
        to="/profile"
        className="bg-gray-100 text-teal-800 px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-lg font-semibold transition duration-300 shadow-md hover:shadow-xl flex items-center hover:bg-gradient-to-r from-gray-800 to-teal-600 hover:text-white hover:border-teal-600">
        <User size={20} className="mr-1" />
        Profile
      </Link>
    </div>
  );
}

// PlanHeader component for displaying and editing the title, type, and save actions
function PlanHeader({
  plan,
  isEditing,
  isSaving,
  isEditingTitle,
  setIsEditingTitle,
  handleEditSave,
  handleSaveToProfile,
  handleAddStep,
  handleTitleEdit,
}) {
  const [tempTitle, setTempTitle] = useState(plan.planTitle); // Temporary state for title editing

  return (
    <div className="flex flex-col sm:flex-row justify-between w-full items-start sm:items-start mb-6">
      <div className="w-full sm:w-auto mb-4 sm:mb-0">
        <PlanTitle
          isEditingTitle={isEditingTitle}
          tempTitle={tempTitle}
          setTempTitle={setTempTitle}
          setIsEditingTitle={setIsEditingTitle}
          handleTitleEdit={handleTitleEdit}
          planTitle={plan.planTitle}
        />
        <PlanInfo
          plan={plan}
          isEditing={isEditing}
          handleAddStep={handleAddStep}
        />
      </div>
      <PlanActions
        isEditing={isEditing}
        isSaving={isSaving}
        handleEditSave={handleEditSave}
        handleSaveToProfile={handleSaveToProfile}
      />
    </div>
  );
}

// Editable plan title section
function PlanTitle({
  isEditingTitle,
  tempTitle,
  setTempTitle,
  setIsEditingTitle,
  handleTitleEdit,
  planTitle,
}) {
  const handleSaveTitle = () => {
    handleTitleEdit(tempTitle); // Save the new title
    setIsEditingTitle(false); // Hide the input and show the updated title
  };

  if (isEditingTitle) {
    return (
      <>
        <input
          type="text"
          value={tempTitle}
          onChange={(e) => setTempTitle(e.target.value)}
          className="text-xl bg-white bg-opacity-95 sm:text-2xl font-bold w-full text-gray-900 mb-2 p-1 rounded-lg"
        />
        <div className="flex items-center flex-wrap mb-3 mt-1 w-full justify-end">
          <button
            onClick={handleSaveTitle} // Call the modified save handler
            className="bg-teal-600 text-sm text-white px-5 py-2 rounded-full">
            Save
          </button>
          <button
            onClick={() => {
              setIsEditingTitle(false);
              setTempTitle(planTitle);
            }}
            className="ml-2 text-sm bg-gray-100 text-gray-800 px-4 py-2 rounded-full">
            Cancel
          </button>
        </div>
      </>
    );
  }

  return (
    <div className="flex justify-between">
      <h1 className="text-xl sm:text-2xl font-bold w-2/3 sm:w-full text-gray-50 mb-3">
        {planTitle} {/* Display the updated title */}
      </h1>
      <Edit2
        onClick={() => setIsEditingTitle(true)} // Show the input field for editing
        className="text-gray-50 cursor-pointer ml-3 hover:text-teal-300"
        size={18}
      />
    </div>
  );
}

// Component for displaying plan type and adding new steps
function PlanInfo({ plan, isEditing, handleAddStep }) {
  return (
    <div className="flex sm:flex-wrap justify-between items-center">
      {plan.planType === 'new_lawn' && plan.establishmentType && (
        <p className="text-md sm:text-md text-gray-50 mb-4 inline-block sm:w-full h-2 sm:mb-2">
          {plan.grassSpeciesName} grow plan using {plan.establishmentType}
        </p>
      )}
      {isEditing && (
        <button
          onClick={handleAddStep}
          className="bg-gray-100 text-teal-800 max-w-fit float-right px-3 py-2 mt-4 relative bottom-2 sm:bottom-0 rounded-full text-sm sm:text-md font-semibold transition duration-300 shadow-md hover:shadow-xl flex items-center justify-center w-full hover:bg-gradient-to-r from-gray-800 to-teal-600 hover:text-white hover:border-teal-600">
          <PlusSquare size={18} className="mr-2" /> Add Step
        </button>
      )}
    </div>
  );
}

// Component for editing or saving plan changes
function PlanActions({
  isEditing,
  isSaving,
  handleEditSave,
  handleSaveToProfile,
}) {
  return (
    <div className="flex flex-col items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
      <div className="w-full flex justify-end sm:my-2">
        <ActionButton
          onClick={handleEditSave}
          disabled={isSaving}
          icon={isEditing ? <Save size={18} /> : <Edit2 size={18} />}
          text={isEditing ? 'Save Changes' : 'Edit Steps'}
        />
        <ActionButton
          onClick={handleSaveToProfile}
          disabled={isSaving}
          icon={<BookmarkPlus size={18} />}
          text="Add to Profile"
        />
      </div>
      <p className="text-gray-50 text-sm sm:text-md text-center sm:text-right">
        Add, change or delete steps then add it to your profile.
      </p>
    </div>
  );
}

function ActionButton({ onClick, disabled, icon, text }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="bg-gray-50 text-teal-800 px-3 py-2 ml-4 mb-3 rounded-full text-sm sm:text-md font-semibold transition duration-300 shadow-md hover:shadow-xl flex items-center justify-center hover:bg-gradient-to-r from-gray-800 to-teal-600 hover:text-white hover:border-teal-600 w-full sm:w-auto">
      {icon}
      <span className="ml-2">{text}</span>
    </button>
  );
}

// Component to render the list of plan steps
function PlanSteps({
  steps,
  isEditing,
  handleStepChange,
  handleDeleteStep,
}: {
  steps: PlanStep[];
  isEditing: boolean;
  handleStepChange: (
    stepId: number,
    field: keyof PlanStep,
    value: string | boolean
  ) => void;
  handleDeleteStep: (stepId: number) => void;
}) {
  return (
    <div className="space-y-4">
      {steps.map((step) => (
        <PlanStep
          key={step.planStepId}
          step={step}
          isEditing={isEditing}
          handleStepChange={handleStepChange}
          handleDeleteStep={handleDeleteStep}
        />
      ))}
    </div>
  );
}

// Individual Plan Step component
function PlanStep({
  step,
  isEditing,
  handleStepChange,
  handleDeleteStep,
}: {
  step: PlanStep;
  isEditing: boolean;
  handleStepChange: (
    stepId: number,
    field: keyof PlanStep,
    value: string | boolean
  ) => void;
  handleDeleteStep: (stepId: number) => void;
}) {
  return (
    <div className="bg-gray-50 bg-opacity-100 p-3 sm:p-4 rounded-lg shadow">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1 pr-2">
          {isEditing ? (
            <input
              type="text"
              value={step.stepDescription}
              onChange={(e) =>
                handleStepChange(
                  step.planStepId,
                  'stepDescription',
                  e.target.value
                )
              }
              className="w-full p-2 border rounded text-sm sm:text-base"
            />
          ) : (
            <p className="text-sm sm:text-lg">{step.stepDescription}</p>
          )}
        </div>
        <button
          onClick={() => handleDeleteStep(step.planStepId)}
          className="ml-2 text-red-800 hover:text-red-600 transition-colors duration-200 flex-shrink-0"
          title="Delete Step">
          <Trash2 size={18} />
        </button>
      </div>
      <div className="flex flex-row justify-between items-start sm:items-center sm:space-y-0">
        <StepDate
          dueDate={step.dueDate}
          isEditing={isEditing}
          onChange={(e) =>
            handleStepChange(step.planStepId, 'dueDate', e.target.value)
          }
        />
        <StepCompletion
          completed={step.completed}
          onChange={(e) =>
            handleStepChange(step.planStepId, 'completed', e.target.checked)
          }
        />
      </div>
    </div>
  );
}

// Step Date component
function StepDate({ dueDate, isEditing, onChange }) {
  return (
    <div className="w-full sm:w-auto">
      <label className="mr-2 text-sm sm:text-base">Due Date:</label>
      {isEditing ? (
        <input
          type="date"
          value={dueDate.split('T')[0]}
          onChange={onChange}
          className="p-1 border rounded text-sm sm:text-base"
        />
      ) : (
        <span className="text-sm sm:text-base">
          {new Date(dueDate).toLocaleDateString()}
        </span>
      )}
    </div>
  );
}

// Step Completion component
function StepCompletion({ completed, onChange }) {
  return (
    <div className="flex items-center w-full sm:w-auto justify-end">
      <label className="mr-2 text-sm sm:text-base">Completed:</label>
      <input
        type="checkbox"
        checked={completed}
        onChange={onChange}
        className="form-checkbox h-5 w-5 rounded-lg accent-teal-800 hover:ring-1 hover:cursor-pointer"
      />
    </div>
  );
}
