import React, { useEffect, useState } from "react";

export interface Assignment {
  id: string
  name: string
  hasTemplate: boolean
}
export interface Course {
  id: string
  name: string
  assignments: Assignment[]
}

const Popup = () => {
  const [courses, setCourses] = useState<Course[]>([])
  const [selectedCourseId, setSelectedCourseId] = useState<string>("")
  const [checkedAssignments, setCheckedAssignments] = useState<Record<string, boolean>>({})
  const [checkedTemplates, setCheckedTemplates] = useState<Record<string, boolean>>({})

  // Fetch courses & assignments from content script
  useEffect(() => {
    chrome.runtime.sendMessage({ action: "FETCH_COURSES_AND_ASSIGNMENTS" }, res => {
      if (res?.courses) setCourses(res.courses)
    })
  }, [])

  const handleCourseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCourseId(e.target.value)
    setCheckedAssignments({})
    setCheckedTemplates({})
  }

  const onAssignmentCheck = (id: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setCheckedAssignments({ ...checkedAssignments, [id]: e.target.checked })
  }

  const onTemplateCheck = (id: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setCheckedTemplates({ ...checkedTemplates, [id]: e.target.checked })
  }

  const selectedCourse = courses.find(c => c.id === selectedCourseId)
  const hasSelected = Object.values(checkedAssignments).some(Boolean)

  const handleDownload = () => {
    chrome.runtime.sendMessage({
      action: "DOWNLOAD_SELECTED_ASSIGNMENTS",
      assignments: Object.keys(checkedAssignments).filter(id => checkedAssignments[id]),
      templates: Object.keys(checkedTemplates).filter(id => checkedTemplates[id]),
      courseId: selectedCourseId
    })
  }

  return (
    <div style={{ minWidth: 300, padding: 16 }}>
      <h3>Canvas Extractor</h3>
      <label>
        Course:
        <select value={selectedCourseId} onChange={handleCourseChange} style={{ width: "100%" }}>
          <option value="">Select...</option>
          {courses.map(course => (
            <option value={course.id} key={course.id}>{course.name}</option>
          ))}
        </select>
      </label>
      <div style={{ marginTop: 12 }}>
        {selectedCourse ? (
          <>
            <p><b>Assignments:</b></p>
            {selectedCourse.assignments.map(a => (
              <div key={a.id} style={{ marginBottom: 8, padding: 4, borderBottom: "1px solid #ddd" }}>
                <label>
                  <input type="checkbox" checked={!!checkedAssignments[a.id]} onChange={onAssignmentCheck(a.id)} />
                  {a.name}
                </label>
                {a.hasTemplate && (
                  <label style={{ marginLeft: 10 }}>
                    <input type="checkbox" checked={!!checkedTemplates[a.id]} onChange={onTemplateCheck(a.id)} />
                    Download linked Google Doc template(s)
                  </label>
                )}
              </div>
            ))}
            <button
              disabled={!hasSelected || !selectedCourseId}
              style={{ marginTop: 12 }}
              onClick={handleDownload}
            >Download Selected</button>
          </>
        ) : <p>Select a course to view assignments.</p>}
      </div>
    </div>
  )
}

export default Popup
