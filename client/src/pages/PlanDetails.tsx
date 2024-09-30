import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useUser } from '../components/useUser';
import { UserPlan, PlanStep } from '../types';
import { Edit2, Save, BookmarkPlus } from 'lucide-react';

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
      } catch (err) {
        setError('Failed to load plan. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlan();
  }, [planId, token]);

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
      // If not in edit mode and toggling completion, save immediately
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
        body: JSON.stringify(planToSave),
      });
      if (!response.ok) {
        throw new Error('Failed to save plan');
      }
      // Optionally, you can fetch the updated plan here
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

  if (isLoading) return <div className="text-center py-8">Loading...</div>;
  if (error)
    return <div className="text-red-500 text-center py-8">{error}</div>;
  if (!plan) return <div className="text-center py-8">No plan found</div>;

  return (
    <div className="py-12 sm:py-20 w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="bg-gray-100 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-emerald-700">
              {plan.planType === 'new_lawn'
                ? 'New Lawn Plan'
                : 'Lawn Improvement Plan'}
            </h1>
            <div className="flex space-x-2">
              <button
                onClick={handleEditSave}
                className="bg-emerald-600 text-white px-4 py-2 rounded-md flex items-center"
                disabled={isSaving}>
                {isEditing ? (
                  <>
                    <Save size={18} className="mr-2" /> Save
                  </>
                ) : (
                  <>
                    <Edit2 size={18} className="mr-2" /> Edit
                  </>
                )}
              </button>
              <Link
                to="#"
                onClick={handleSaveToProfile}
                className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center">
                <BookmarkPlus size={18} className="mr-2" /> Confirm
              </Link>
            </div>
          </div>
          <p className="text-lg font-semibold text-gray-700 mb-4">
            {plan.grassSpeciesName}
          </p>
          <div className="space-y-6">
            {plan.steps.map((step, index) => (
              <div
                key={step.planStepId}
                className="bg-white p-4 rounded-md shadow">
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
                      className="form-checkbox h-5 w-5 text-emerald-600"
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
