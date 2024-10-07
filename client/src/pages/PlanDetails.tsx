import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useUser } from '../components/useUser';
import type { UserPlan, PlanStep } from '../types';
import {
  Edit2,
  Trash2,
  Save,
  BookmarkPlus,
  PlusSquare,
  User,
} from 'lucide-react';
import { ConfirmDeleteModal, SavedToProfileModal } from '../components/Modals';

// Main PlanDetails component
export function PlanDetails() {
  const { planId } = useParams<{ planId: string }>();
  const { user, token } = useUser();
  const navigate = useNavigate();
  const [plan, setPlan] = useState<UserPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [stepToDelete, setStepToDelete] = useState<PlanStep | null>(null);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  // Fetch plan data
  const fetchPlan = useCallback(async () => {
    if (!token || !planId) {
      console.log('Token or planId not available, waiting...');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/plans/${planId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch plan');
      }
      const data: UserPlan = await response.json();
      data.steps.sort(
        (a, b) => (a.stepOrder ?? Infinity) - (b.stepOrder ?? Infinity)
      );
      setPlan(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching plan:', err);
      setError('Failed to load plan. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [token, planId]);

  useEffect(() => {
    if (!planId) {
      setError('Invalid plan ID');
      return;
    }
    fetchPlan();
  }, [planId, fetchPlan]);

  //Function to handle editing plan title
  const handleTitleEdit = async (newTitle: string) => {
    if (!plan || !planId) return;

    try {
      const updatedPlan = { ...plan, planTitle: newTitle };
      const response = await fetch(`/api/plans/${planId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedPlan),
      });

      if (!response.ok) {
        throw new Error('Failed to update plan title');
      }

      const result = await response.json();
      setPlan(result);
      setIsEditingTitle(false);
    } catch (err) {
      setError('Failed to update plan title. Please try again.');
    }
  };

  // Add new step
  const handleAddStep = async () => {
    if (!plan || !planId) return;

    // Calculate the next stepOrder
    const nextStepOrder =
      plan.steps.length > 0
        ? Math.max(...plan.steps.map((step) => step.stepOrder ?? 0)) + 1
        : 1;
    1;

    const newStep: Omit<PlanStep, 'planStepId'> = {
      userPlanId: parseInt(planId),
      templateId: null,
      stepDescription: 'Add step details here',
      dueDate: new Date().toISOString().split('T')[0],
      completed: false,
      completedAt: null,
      createdAt: new Date().toISOString(),
      stepOrder: nextStepOrder,
    };

    try {
      const response = await fetch(`/api/plans/${planId}/steps`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newStep),
      });

      if (!response.ok) {
        throw new Error('Failed to add new step');
      }

      const addedStep: PlanStep = await response.json();
      setPlan((prevPlan) => {
        if (!prevPlan) return null;
        const newSteps = [...prevPlan.steps, addedStep];
        newSteps.sort(
          (a, b) => (a.stepOrder ?? Infinity) - (b.stepOrder ?? Infinity)
        );
        return { ...prevPlan, steps: newSteps };
      });
    } catch (err) {
      setError('Failed to add new step. Please try again.');
    }
  };

  // Handle step change
  const handleStepChange = async (
    stepId: number,
    field: keyof PlanStep,
    value: string | boolean
  ) => {
    if (!plan) return;
    const updatedSteps = plan.steps.map((step) =>
      step.planStepId === stepId ? { ...step, [field]: value } : step
    );
    const updatedPlan = { ...plan, steps: updatedSteps };
    setPlan(updatedPlan);

    if (!isEditing && field === 'completed') {
      try {
        const response = await fetch(
          `/api/plans/${plan.userPlanId}/steps/${stepId}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              [field]: value,
              completedAt: value ? new Date().toISOString() : null,
            }),
          }
        );

        if (!response.ok) {
          throw new Error('Failed to update step');
        }
      } catch (err) {
        setError('Failed to update step. Please try again.');
        // Revert the local state change if the API call failed
        setPlan(plan);
      }
    }
  };

  // Save plan
  const handleSavePlan = async (planToSave: UserPlan) => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/plans/${planId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...planToSave,
          lawnType: planToSave.establishmentType,
          steps: planToSave.steps.map((step) => ({
            ...step,
            dueDate: new Date(step.dueDate).toISOString(),
          })),
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to save plan');
      }
      const updatedPlan = await response.json();
      setPlan(updatedPlan);
    } catch (err) {
      setError('Failed to save plan. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle edit/save toggle
  const handleEditSave = () => {
    if (isEditing) {
      handleSavePlan(plan!);
    }
    setIsEditing(!isEditing);
  };

  // Save plan to user profile
  const handleSaveToProfile = async () => {
    if (!plan) return;
    setIsSaving(true);
    try {
      const response = await fetch(`/api/users/${user?.userId}/plans`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ planId: plan.userPlanId }),
      });
      if (!response.ok) {
        throw new Error('Failed to save plan to profile');
      }
      setIsSavedModalOpen(true);
    } catch (err) {
      setError('Failed to save plan to profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete step
  const handleDeleteStep = async (step: PlanStep) => {
    setStepToDelete(step);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteStep = async () => {
    if (!plan || !planId || !stepToDelete) return;

    try {
      const response = await fetch(
        `/api/plans/${planId}/steps/${stepToDelete.planStepId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete step');
      }

      setPlan((prevPlan) => {
        if (!prevPlan) return null;
        const updatedSteps = prevPlan.steps.filter(
          (step) => step.planStepId !== stepToDelete.planStepId
        );
        return { ...prevPlan, steps: updatedSteps };
      });
    } catch (err) {
      setError('Failed to delete step. Please try again.');
    } finally {
      setIsDeleteModalOpen(false);
      setStepToDelete(null);
    }
  };

  if (!token) return <div className="text-center py-8">Authenticating...</div>;
  if (isLoading) return <div className="text-center py-8">Loading...</div>;
  if (error)
    return <div className="text-red-500 text-center py-8">{error}</div>;
  if (!plan) return <div className="text-center py-8">No plan found</div>;

  //Main PlanDetails JSX
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
          handleAddStep={handleAddStep}
          handleStepChange={handleStepChange}
          handleDeleteStep={handleDeleteStep}
          handleTitleEdit={handleTitleEdit}
        />
      </div>
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteStep}
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

// Plan Card component
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
      <div className="flex justify-between mb-6 mx-2">
        <Link
          to="/new-plan"
          className="bg-gray-100 text-teal-800 w-fit px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-lg font-semibold transition duration-300 shadow-md hover:shadow-xl flex items-center hover:bg-gradient-to-r from-gray-800 to-teal-600 hover:text-white hover:border-teal-600">
          <PlusSquare size={20} className="mr-1 sm:mr-2" />
          New Plan
        </Link>
        <Link
          to="/profile"
          className="bg-gray-100 text-teal-800 w-fit px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-lg font-semibold transition duration-300 shadow-md hover:shadow-xl flex items-center hover:bg-gradient-to-r from-gray-800 to-teal-600 hover:text-white hover:border-teal-600">
          <User size={20} className="mr-1" />
          Profile
        </Link>
      </div>
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

//Plan Header component
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
  const [tempTitle, setTempTitle] = useState(plan.planTitle);

  return (
    <div className="flex flex-col sm:flex-row justify-between w-full items-start sm:items-start mb-6">
      <div className="w-full sm:w-auto mb-4 sm:mb-0">
        {isEditingTitle ? (
          <>
            <input
              type="text"
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
              className="text-xl bg-white bg-opacity-95 sm:text-2xl font-bold w-full text-gray-900 mb-2 p-1 rounded-lg"
            />
            <div className="flex items-center flex-wrap mb-3 mt-1 w-full justify-end">
              <button
                onClick={() => handleTitleEdit(tempTitle)}
                className=" bg-teal-600 text-sm text-white px-5 py-2 rounded-full">
                Save
              </button>
              <button
                onClick={() => {
                  setIsEditingTitle(false);
                  setTempTitle(plan.planTitle);
                }}
                className="ml-2 text-sm bg-gray-100 text-gray-800 px-4 py-2 rounded-full">
                Cancel
              </button>
            </div>
          </>
        ) : (
          <div className="flex justify-between">
            <h1 className="text-xl sm:text-2xl font-bold w-2/3 sm:w-full text-gray-50 mb-3">
              {plan.planTitle}
            </h1>
            <Edit2
              onClick={() => setIsEditingTitle(true)}
              className="text-gray-50 cursor-pointer ml-3 hover:text-teal-300"
              size={18}
            />
          </div>
        )}
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
      </div>
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
    </div>
  );
}

// Action Button component
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

// Plan Steps component
function PlanSteps({ steps, isEditing, handleStepChange, handleDeleteStep }) {
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
function PlanStep({ step, isEditing, handleStepChange, handleDeleteStep }) {
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
          onClick={() => handleDeleteStep(step)}
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
