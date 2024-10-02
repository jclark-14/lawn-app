import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useUser } from '../components/useUser';
import { UserPlan, PlanStep } from '../types';
import { Edit2, Trash2, Save, BookmarkPlus, PlusCircle } from 'lucide-react';

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

    fetchPlan();
  }, [planId, token]);

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

      // Temporarily add the new step to the top of the list
      setPlan((prevPlan) => ({
        ...prevPlan!,
        steps: [addedStep, ...prevPlan!.steps], // Add the new step at the top
      }));
    } catch (err) {
      setError('Failed to add new step. Please try again.');
    }
  };

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
      // Update the local state with the response data
      const updatedPlan = await response.json();
      setPlan(updatedPlan);
      console.log(plan);
    } catch (err) {
      setError('Failed to save plan. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditSave = () => {
    if (isEditing) {
      handleSavePlan(plan!);
    }
    setIsEditing(!isEditing);
  };

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
      navigate(`/${user?.username}`);
      alert('Plan saved to your profile successfully!');
    } catch (err) {
      setError('Failed to save plan to profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

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

  if (!token) {
    return <div className="text-center py-8">Authenticating...</div>;
  }
  if (isLoading) return <div className="text-center py-8">Loading...</div>;
  if (error)
    return <div className="text-red-500 text-center py-8">{error}</div>;
  if (!plan) return <div className="text-center py-8">No plan found</div>;

  return (
    <div className="py-12 sm:py-20 w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="bg-emerald-900 bg-opacity-60 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-50">
                {plan.grassSpeciesName}
              </h1>
              {plan.planType === 'new_lawn' && (
                <p className="text-lg text-gray-50 mb-4">
                  New Grow Plan using{' '}
                  {plan.establishmentType.charAt(0).toUpperCase() +
                    plan.establishmentType.slice(1)}
                </p>
              )}
              {isEditing && (
                <button
                  onClick={handleAddStep}
                  className="bg-gray-100 text-emerald-800 max-w-fit px-4 py-2 rounded-full text-md font-semibold transition duration-300 shadow-md hover:shadow-xl flex items-center justify-center w-full hover:bg-gradient-to-r from-emerald-700 to-teal-700 hover:text-white hover:border-emerald-600">
                  <PlusCircle size={20} className="mr-2" /> Add Step
                </button>
              )}
            </div>
            <div className="flex flex-col items-end mt-3 space-y-4">
              <div className="flex space-x-2">
                <button
                  onClick={handleEditSave}
                  className="bg-gray-100 bg-opacity-95 text-emerald-800 px-4 py-3 rounded-full text-md font-semibold transition duration-300 shadow-md hover:shadow-xl flex items-center hover:bg-gradient-to-r from-emerald-700 to-teal-700 hover:text-white hover:border-emerald-600"
                  disabled={isSaving}>
                  {isEditing ? (
                    <>
                      <Save size={18} className="mr-2" /> Save Changes
                    </>
                  ) : (
                    <>
                      <Edit2 size={18} className="mr-2" /> Edit Steps
                    </>
                  )}
                </button>
                <Link
                  to="#"
                  onClick={handleSaveToProfile}
                  className="bg-gray-100 bg-opacity-95 text-emerald-800 px-4 py-3 rounded-full text-md font-semibold transition duration-300 shadow-md hover:shadow-xl flex items-center hover:bg-gradient-to-r from-emerald-700 to-teal-700 hover:text-white hover:border-emerald-600">
                  <BookmarkPlus size={18} className="mr-2" /> Add to Profile
                </Link>
              </div>
              <p className="text-gray-50 text-md">
                Add, change or delete steps then add it to your profile.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {plan.steps.map((step, index) => (
              <div
                key={step.planStepId}
                className="bg-gray-50 bg-opacity-100 p-4 rounded-lg shadow">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    {isEditing ? (
                      <input
                        type="text"
                        value={step.stepDescription}
                        onChange={(e) =>
                          handleStepChange(
                            index,
                            'stepDescription',
                            e.target.value
                          )
                        }
                        className="w-full p-2 border rounded"
                      />
                    ) : (
                      <p className="text-lg">{step.stepDescription}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteStep(step.planStepId)}
                    className="ml-2 text-teal-800 hover:text-red-800 transition-colors duration-200"
                    title="Delete Step">
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <label className="mr-2">Due Date:</label>
                    {isEditing ? (
                      <input
                        type="date"
                        value={step.dueDate.split('T')[0]}
                        onChange={(e) =>
                          handleStepChange(index, 'dueDate', e.target.value)
                        }
                        className="p-1 border rounded"
                      />
                    ) : (
                      <span>{new Date(step.dueDate).toLocaleDateString()}</span>
                    )}
                  </div>
                  <div className="flex items-center">
                    <label className="mr-2">Completed:</label>
                    <input
                      type="checkbox"
                      checked={step.completed}
                      onChange={(e) =>
                        handleStepChange(index, 'completed', e.target.checked)
                      }
                      className="form-checkbox h-5 w-5 rounded-lg accent-gray-500 hover:ring-1 hover:cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
