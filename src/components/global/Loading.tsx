import { Dumbbell } from "lucide-react"

const Loading = () => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="flex gap-4">
        {[...Array(3)].map((_, i) => (
          <Dumbbell
            key={i}
            className="text-white w-8 h-8 animate-bounce"
            style={{
              animationDelay: `${i * 0.2}s`,
              opacity: 0.7,
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default Loading
