const Section = ({
  title,
  icon,
  description,
  children,
}: {
  title: string
  icon: React.ReactNode
  description?: string
  children: React.ReactNode
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gray-50 rounded-lg">{icon}</div>
        <div>
          <h2 className="font-medium text-gray-900">{title}</h2>
          {description && (
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          )}
        </div>
      </div>
      {children}
    </div>
  )
}

export default Section
