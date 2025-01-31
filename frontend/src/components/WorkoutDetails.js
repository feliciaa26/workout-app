import { useState } from 'react'
import { useWorkoutsContext } from '../hooks/useWorkoutsContext'
import { useAuthContext } from '../hooks/useAuthContext'

// date fns
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

const WorkoutDetails = ({ workout }) => {
  const { dispatch } = useWorkoutsContext()
  const { user } = useAuthContext()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    title: workout.title,
    load: workout.load,
    reps: workout.reps
  })

  const handleDelete = async () => {
    if (!user) {
      return
    }

    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/workouts/${workout._id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${user.token}`
      }
    })
    const json = await response.json()

    if (response.ok) {
      dispatch({type: 'DELETE_WORKOUT', payload: json})
    }
  }

  const handleEditToggle = () => {
    setIsEditing(!isEditing)
  }

  const handleUpdate = async () => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/workouts/${workout._id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
    const json = await response.json()
  
    if (response.ok) {
      dispatch({ type: 'UPDATE_WORKOUT', payload: json }) 
      setIsEditing(false)
    }
  }

  return (
    <div className="workout-details">
      {isEditing ? (
        <div>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <input
            type="number"
            value={formData.load}
            onChange={(e) => setFormData({ ...formData, load: e.target.value })}
          />
          <input
            type="number"
            value={formData.reps}
            onChange={(e) => setFormData({ ...formData, reps: e.target.value })}
          />
          <button onClick={handleUpdate}>Update</button>
          <button onClick={handleEditToggle}>Cancel</button>
        </div>
      ) : (
        <div>
          <h4>{workout.title}</h4>
          <p><strong>Load (kg): </strong>{workout.load}</p>
          <p><strong>Number of reps: </strong>{workout.reps}</p>
          <p>{formatDistanceToNow(new Date(workout.createdAt), { addSuffix: true })}</p>
          <button onClick={handleEditToggle}>Edit</button>
          <span className="material-symbols-outlined" onClick={handleDelete}>delete</span>
        </div>
      )}
    </div>
  )
}

export default WorkoutDetails
