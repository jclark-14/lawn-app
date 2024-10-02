import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../components/useUser';
import type { UserPlan, PlanStep } from '../types';
import { Edit2, Trash2, Save, BookmarkPlus, PlusCircle } from 'lucide-react';

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

  useEffect(() => {
    if (!planId) {
      setError('Invalid plan ID');
      return;
    }
    fetchPlan();
  }, [planId, token]);

  // Fetch plan data
  const fetchPlan = async () => {
    if (!token) {
      console.log('Token not available, waiting...');
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
      setPlan(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching plan:', err);
      setError('Failed to load plan. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Add new step
  const handleAddStep = async () => {
    if (!plan || !planId) return;

    const newStep: Omit<PlanStep, 'planStepId'> = {
      userPlanId: parseInt(planId),
      templateId: null,
      stepDescription: 'Add step details here',
      dueDate: new Date().toISOString().split('T')[0],
      completed: false,
      completedAt: null,
      createdAt: new Date().toISOString(),
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
      setPlan((prevPlan) => ({
        ...prevPlan!,
        steps: [addedStep, ...prevPlan!.steps],
      }));
    } catch (err) {
      setError('Failed to add new step. Please try again.');
    }
  };

  // Handle step change
  const handleStepChange = async (
    index: number,
    field: keyof PlanStep,
    value: string | boolean
  ) => {
    if (!plan) return;
    const newSteps = [...plan.steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    const updatedPlan = { ...plan, steps: newSteps };
    setPlan(updatedPlan);

    if (!isEditing && field === 'completed') {
      await handleSavePlan(updatedPlan);
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
      navigate('/profile');
      alert('Plan saved to your profile successfully!');
    } catch (err) {
      setError('Failed to save plan to profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete step
  const handleDeleteStep = async (stepId: number) => {
    if (!plan || !planId) return;

    try {
      const response = await fetch(`/api/plans/${planId}/steps/${stepId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete step');
      }

      const updatedSteps = plan.steps.filter(
        (step) => step.planStepId !== stepId
      );
      setPlan({ ...plan, steps: updatedSteps });
    } catch (err) {
      setError('Failed to delete step. Please try again.');
    }
  };

  // Format establishment type for display
  const formatEstablishmentType = (type: string) => {
    return type
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' or ');
  };

  if (!token) return <div className="text-center py-8">Authenticating...</div>;
  if (isLoading) return <div className="text-center py-8">Loading...</div>;
  if (error)
    return <div className="text-red-500 text-center py-8">{error}</div>;
  if (!plan) return <div className="text-center py-8">No plan found</div>;

  return (
    <div className="py-6 sm:py-12 w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <PlanCard
          plan={plan}
          isEditing={isEditing}
          isSaving={isSaving}
          handleEditSave={handleEditSave}
          handleSaveToProfile={handleSaveToProfile}
          handleAddStep={handleAddStep}
          handleStepChange={handleStepChange}
          handleDeleteStep={handleDeleteStep}
          formatEstablishmentType={formatEstablishmentType}
        />
      </div>
    </div>
  );
}

// Plan Card component
function PlanCard({
  plan,
  isEditing,
  isSaving,
  handleEditSave,
  handleSaveToProfile,
  handleAddStep,
  handleStepChange,
  handleDeleteStep,
  formatEstablishmentType,
}) {
  return (
    <div className="bg-teal-900 bg-opacity-60 rounded-lg shadow-lg p-4 sm:p-6 mb-8">
      <PlanHeader
        plan={plan}
        isEditing={isEditing}
        isSaving={isSaving}
        handleEditSave={handleEditSave}
        handleSaveToProfile={handleSaveToProfile}
        handleAddStep={handleAddStep}
        formatEstablishmentType={formatEstablishmentType}
      />
      <PlanSteps
        steps={plan.steps}
        isEditing={isEditing}
        handleStepChange={handleStepChange}
        handleDeleteStep={handleDeleteStep}
      />
    </div>
  );
}

// Reconfigured Plan Header component
function PlanHeader({
  plan,
  isEditing,
  isSaving,
  handleEditSave,
  handleSaveToProfile,
  handleAddStep,
  formatEstablishmentType,
}) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
      <div className="w-full sm:w-auto mb-4 sm:mb-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-50 mb-2">
          {plan.grassSpeciesName}
        </h1>
        {plan.planType === 'new_lawn' && plan.establishmentType && (
          <p className="text-md sm:text-lg text-gray-50 mb-4">
            Grow plan using {formatEstablishmentType(plan.establishmentType)}
          </p>
        )}
        {isEditing && (
          <button
            onClick={handleAddStep}
            className="bg-gray-100 text-teal-800 max-w-fit px-3 py-2 mt-2 rounded-full text-sm sm:text-md font-semibold transition duration-300 shadow-md hover:shadow-xl flex items-center justify-center w-full hover:bg-gradient-to-r from-slate-600 to-teal-600 hover:text-white hover:border-teal-600">
            <PlusCircle size={18} className="mr-2" /> Add Step
          </button>
        )}
      </div>
      <div className="flex flex-col items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
        <div className="w-full flex justify-end">
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
      className="bg-gray-100 bg-opacity-95 text-teal-800 px-3 py-2 ml-4 mb-3 rounded-full text-sm sm:text-md font-semibold transition duration-300 shadow-md hover:shadow-xl flex items-center justify-center hover:bg-gradient-to-r from-slate-600 to-teal-600 hover:text-white hover:border-teal-600 w-full sm:w-auto">
      {icon}
      <span className="ml-2">{text}</span>
    </button>
  );
}

// Plan Steps component
function PlanSteps({ steps, isEditing, handleStepChange, handleDeleteStep }) {
  return (
    <div className="space-y-4">
      {steps.map((step, index) => (
        <PlanStep
          key={step.planStepId}
          step={step}
          index={index}
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
  index,
  isEditing,
  handleStepChange,
  handleDeleteStep,
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
                handleStepChange(index, 'stepDescription', e.target.value)
              }
              className="w-full p-2 border rounded text-sm sm:text-base"
            />
          ) : (
            <p className="text-sm sm:text-lg">{step.stepDescription}</p>
          )}
        </div>
        <button
          onClick={() => handleDeleteStep(step.planStepId)}
          className="ml-2 text-teal-800 hover:text-red-800 transition-colors duration-200 flex-shrink-0"
          title="Delete Step">
          <Trash2 size={18} />
        </button>
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
        <StepDate
          dueDate={step.dueDate}
          isEditing={isEditing}
          onChange={(e) => handleStepChange(index, 'dueDate', e.target.value)}
        />
        <StepCompletion
          completed={step.completed}
          onChange={(e) =>
            handleStepChange(index, 'completed', e.target.checked)
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
        className="form-checkbox h-5 w-5 rounded-lg accent-gray-500 hover:ring-1 hover:cursor-pointer"
      />
    </div>
  );
}
