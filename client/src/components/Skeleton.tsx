//ClimateResults Skeleton CSS
export function ClimateResultsSkeleton() {
  return (
    <div className="py-12 sm:py-12 min-h-screen w-full">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <ClimateHeaderSkeleton />
        <ClimateNavigationSkeleton />
        <div className="flex flex-col lg:flex-row gap-8">
          <GrassMatchesSectionSkeleton />
          <ClimateDataSectionSkeleton />
        </div>
      </div>
    </div>
  );
}

function ClimateHeaderSkeleton() {
  return (
    <div className="h-10 bg-gray-200 rounded w-3/4 mx-auto mb-4 animate-pulse" />
  );
}

function ClimateNavigationSkeleton() {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="h-12 w-32 bg-gray-200 rounded-full animate-pulse" />
      <div className="h-12 w-32 bg-gray-200 rounded-full animate-pulse" />
    </div>
  );
}

function GrassMatchesSectionSkeleton() {
  return (
    <div className="w-full lg:w-2/3 bg-gray-200 rounded-lg p-4 animate-pulse">
      <div className="h-8 bg-gray-300 rounded w-1/2 mb-4" />
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <GrassMatchCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}

function GrassMatchCardSkeleton() {
  return (
    <div className="bg-gray-100 rounded-lg shadow-md overflow-hidden p-6">
      <div className="flex justify-between items-center mb-2">
        <div className="h-6 bg-gray-300 rounded w-1/3" />
        <div className="h-6 bg-gray-300 rounded w-1/4" />
      </div>
      <div className="w-full bg-gray-300 rounded-full h-2.5 mb-4" />
      <div className="h-6 bg-gray-300 rounded w-1/4" />
    </div>
  );
}

function ClimateDataSectionSkeleton() {
  return (
    <div className="w-full lg:w-1/3 bg-gray-200 rounded-lg p-4 h-fit animate-pulse">
      <div className="h-8 bg-gray-300 rounded w-2/3 mb-4" />
      <div className="bg-gray-100 rounded-lg shadow-md p-4">
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <ClimateDataItemSkeleton key={index} />
          ))}
        </div>
        <div className="h-6 bg-gray-300 rounded w-1/2 mt-4" />
      </div>
    </div>
  );
}

function ClimateDataItemSkeleton() {
  return (
    <div className="flex items-center">
      <div className="h-6 w-6 bg-gray-300 rounded-full" />
      <div className="ml-3 flex-grow">
        <div className="h-4 bg-gray-300 rounded w-1/2 mb-1" />
        <div className="h-4 bg-gray-300 rounded w-1/3" />
      </div>
    </div>
  );
}

//NewPlan Skeleton CSS
export function NewPlanSkeleton() {
  return (
    <div className="py-12 sm:pb-18 sm:pt-18 w-full animate-pulse">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-lg">
        <NewPlanBackSkeleton />
        <PlanFormSkeleton />
      </div>
    </div>
  );
}

function NewPlanBackSkeleton() {
  return (
    <div className="flex justify-between items-center mb-10">
      <div className="flex justify-center">
        <div className="bg-gray-200 w-40 h-14 rounded-full" />
      </div>
    </div>
  );
}

function PlanFormSkeleton() {
  return (
    <div className="bg-gray-200 rounded-lg shadow-lg p-8">
      <div className="h-10 bg-gray-300 w-3/4 mx-auto mb-8 rounded" />
      <div className="space-y-6">
        <NewPlanSelectSkeleton />
        <NewPlanSelectSkeleton />
        <NewPlanSelectSkeleton />
        <NewPlanSubmitSkeleton />
      </div>
    </div>
  );
}

function NewPlanSelectSkeleton() {
  return (
    <div>
      <div className="h-6 bg-gray-300 w-1/3 mb-2 rounded" />
      <div className="h-10 bg-gray-300 w-full rounded" />
    </div>
  );
}

function NewPlanSubmitSkeleton() {
  return <div className="h-14 bg-gray-300 w-full rounded-full mt-10" />;
}

//PlanDetails Skeleton CSS
export function PlanDetailsSkeleton() {
  return (
    <div className="py-6 sm:py-12 w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <PlanCardSkeleton />
      </div>
    </div>
  );
}

function PlanCardSkeleton() {
  return (
    <div>
      <PlanNavigationSkeleton />
      <div className="bg-gray-200 rounded-lg shadow-lg p-4 sm:p-6 mb-8 animate-pulse">
        <PlanHeaderSkeleton />
        <PlanStepsSkeleton />
      </div>
    </div>
  );
}

function PlanNavigationSkeleton() {
  return (
    <div className="flex justify-between mb-6 mx-2">
      <div className="h-12 w-32 bg-gray-200 rounded-full animate-pulse" />
      <div className="h-12 w-32 bg-gray-200 rounded-full animate-pulse" />
    </div>
  );
}

function PlanHeaderSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row justify-between w-full items-start sm:items-start mb-6">
      <div className="w-full sm:w-auto mb-4 sm:mb-0">
        <div className="h-8 bg-gray-300 rounded w-3/4 mb-3" />
        <div className="h-6 bg-gray-300 rounded w-1/2 mb-4" />
      </div>
      <div className="flex flex-col items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
        <div className="w-full flex justify-end sm:my-2">
          <div className="h-10 w-32 bg-gray-300 rounded-full ml-4 mb-3" />
          <div className="h-10 w-32 bg-gray-300 rounded-full ml-4 mb-3" />
        </div>
        <div className="h-4 bg-gray-300 rounded w-full sm:w-64" />
      </div>
    </div>
  );
}

function PlanStepsSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, index) => (
        <PlanStepSkeleton key={index} />
      ))}
    </div>
  );
}

function PlanStepSkeleton() {
  return (
    <div className="bg-gray-100 p-3 sm:p-4 rounded-lg shadow">
      <div className="flex justify-between items-start mb-2">
        <div className="h-6 bg-gray-300 rounded w-3/4" />
        <div className="h-6 w-6 bg-gray-300 rounded-full" />
      </div>
      <div className="flex flex-row justify-between items-start sm:items-center sm:space-y-0">
        <div className="h-4 bg-gray-300 rounded w-1/3" />
        <div className="h-5 w-5 bg-gray-300 rounded" />
      </div>
    </div>
  );
}

//UserProfile Skeleton CSS
export function UserProfileSkeleton() {
  return (
    <div className="py-12 sm:py-16 w-full animate-pulse">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <div className="bg-white shadow rounded-lg p-8">
          <UserHeaderSkeleton />
          <UserDetailsSkeleton />
          <UserStatsSkeleton />
        </div>
      </div>
    </div>
  );
}

function UserHeaderSkeleton() {
  return (
    <div className="flex items-center mb-8">
      <div className="w-24 h-24 bg-gray-200 rounded-full mr-6" />
      <div>
        <div className="h-8 bg-gray-200 w-48 mb-2 rounded" />
        <div className="h-4 bg-gray-200 w-32 rounded" />
      </div>
    </div>
  );
}

function UserDetailsSkeleton() {
  return (
    <div className="mb-8">
      <div className="h-6 bg-gray-200 w-1/4 mb-4 rounded" />
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="flex">
            <div className="h-5 bg-gray-200 w-1/4 mr-4 rounded" />
            <div className="h-5 bg-gray-200 w-1/2 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

function UserStatsSkeleton() {
  return (
    <div>
      <div className="h-6 bg-gray-200 w-1/4 mb-4 rounded" />
      <div className="grid grid-cols-3 gap-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="bg-gray-100 p-4 rounded-lg">
            <div className="h-8 bg-gray-200 w-3/4 mb-2 rounded" />
            <div className="h-6 bg-gray-200 w-1/2 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
