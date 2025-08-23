import React, { useState } from 'react'

const GENRES = [
    'Horror', 'Comedy', 'Sci-Fi', 'Drama', 'Action', 'Romance', 'Thriller', 'Fantasy',
    'Mystery', 'Western', 'Crime', 'Adventure', 'Historical', 'War', 'Biography', 'Documentary'
]

const PROMPT_TYPES = [
    'Blind Challenge', 'Plot Twist Injection', 'Open Challenge'
]

const TIME_OPTIONS = [
    { value: 10, label: '10 minutes' },
    { value: 20, label: '20 minutes' },
    { value: 30, label: '30 minutes' },
    { value: 60, label: '1 hour' }
]

const WORD_CAPS = [
    { value: 500, label: '500 words' },
    { value: 750, label: '750 words' },
    { value: 1000, label: '1000 words' }
]

const BadgeComponent = ({ type, children }) => (
    <span style={{
        backgroundColor: type === 'fixed' ? '#ef4444' : '#8b5cf6',
        color: 'white',
        fontSize: '12px',
        padding: '2px 8px',
        borderRadius: '4px',
        fontWeight: 'bold'
    }}>
        {children}
    </span>
)

const SectionHeader = ({ icon, title, badge }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>
            {icon} {title}
        </h3>
        <BadgeComponent type={badge.type}>{badge.text}</BadgeComponent>
    </div>
)

const ButtonGroup = ({ options, selected, onSelect, colorScheme = 'blue' }) => {
    const colors = {
        blue: { border: '#3b82f6', bg: '#eff6ff', text: '#1d4ed8' },
        green: { border: '#10b981', bg: '#d1fae5', text: '#047857' },
        purple: { border: '#8b5cf6', bg: '#f3e8ff', text: '#7c3aed' }
    }

    return (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {options.map(option => {
                const isSelected = Array.isArray(selected)
                    ? selected.includes(option.value || option)
                    : selected === (option.value || option)

                return (
                    <button
                        key={option.value || option}
                        onClick={() => onSelect(option.value || option)}
                        style={{
                            padding: '8px 16px',
                            border: '2px solid',
                            borderColor: isSelected ? colors[colorScheme].border : '#e5e7eb',
                            borderRadius: '8px',
                            backgroundColor: isSelected ? colors[colorScheme].bg : 'white',
                            color: isSelected ? colors[colorScheme].text : '#374151',
                            cursor: 'pointer',
                            fontWeight: isSelected ? 'bold' : 'normal',
                            fontSize: '14px'
                        }}
                    >
                        {Array.isArray(selected) && isSelected && '✓ '}
                        {option.label || option}
                    </button>
                )
            })}
        </div>
    )
}

const ErrorMessage = ({ error }) => (
    error ? <p style={{ color: '#ef4444', fontSize: '14px', margin: '0 0 8px 0' }}>{error}</p> : null
)

const CheckboxField = ({ checked, onChange, label, description }) => (
    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
        <input
            type="checkbox"
            checked={checked}
            onChange={onChange}
            style={{ transform: 'scale(1.2)' }}
        />
        <div>
            {label}
            {description && <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#6b7280' }}>{description}</p>}
        </div>
    </label>
)

export default function MatchSettings({ onStartMatch, onCancel }) {
    const [settings, setSettings] = useState({
        timeLimit: 20,
        genres: ['Horror', 'Comedy', 'Sci-Fi'],
        promptType: 'Blind Challenge',
        promptText: 'no dialogues, set in steampunk 1920s',
        wordCap: 500,
        objectInclusion: '',
        reverseChallenge: false,
        isBlindPrompt: true,
        plotTwistText: ''
    })

    const [errors, setErrors] = useState({})

    const updateSetting = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }))
    }

    const handleGenreToggle = (genre) => {
        updateSetting('genres',
            settings.genres.includes(genre)
                ? settings.genres.filter(g => g !== genre)
                : [...settings.genres, genre]
        )
    }

    const validateSettings = () => {
        const newErrors = {}

        if (settings.genres.length === 0) newErrors.genres = 'Select at least one genre'
        if (!settings.promptText.trim()) newErrors.promptText = 'Prompt text is required'
        if (settings.objectInclusion && settings.objectInclusion.length < 3) {
            newErrors.objectInclusion = 'Object/word must be at least 3 characters'
        }
        if (settings.promptType === 'Plot Twist Injection' && !settings.plotTwistText.trim()) {
            newErrors.plotTwistText = 'Plot twist details are required'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleStartMatch = async () => {
        if (!validateSettings()) return  // Use existing validation

        try {
            const response = await fetch('/api/match/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings),  // Use component state directly
            })

            if (!response.ok) {
                const errText = await response.text()
                throw new Error(`Failed to create match: ${errText}`)
            }

            const result = await response.json()
            console.log('Match created:', result)

            // Call the parent callback if needed
            onStartMatch?.(settings)
            window.location.href = '/StoryEditor';
        } catch (error) {
            console.error('Error creating match:', error.message)
            setErrors({ general: error.message })  // Show error in UI
        }
    }



    const summaryItems = [
        { label: 'Time', value: `${settings.timeLimit} minutes` },
        { label: 'Genres', value: settings.genres.join(', ') },
        { label: 'Prompt', value: `${settings.isBlindPrompt ? '[BLIND] ' : ''}${settings.promptText}` },
        ...(settings.promptType === 'Plot Twist Injection' && settings.plotTwistText
            ? [{ label: 'Plot Twist', value: settings.plotTwistText }] : []),
        ...(settings.wordCap ? [{ label: 'Word Limit', value: `${settings.wordCap} words` }] : []),
        ...(settings.objectInclusion ? [{ label: 'Must Include', value: `"${settings.objectInclusion}"` }] : []),
        ...(settings.reverseChallenge ? [{ label: 'Special', value: 'Reverse Challenge' }] : [])
    ]

    return (
        <div style={{
            maxWidth: '800px',
            margin: '0 auto',
            padding: '24px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            color: 'black'
        }}>
            <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                overflow: 'hidden'
            }}>
                {/* Header */}
                <div style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    padding: '24px',
                    textAlign: 'center'
                }}>
                    <h1 style={{ margin: '0 0 8px 0', fontSize: '28px', fontWeight: 'bold' }}>
                        ⚡ New Writing Match
                    </h1>
                    <p style={{ margin: 0, fontSize: '16px', opacity: 0.9 }}>
                        Configure your challenge settings
                    </p>
                </div>

                <div style={{ padding: '32px' }}>
                    {/* Time Limit */}
                    <div style={{ marginBottom: '32px' }}>
                        <SectionHeader
                            icon="⏱️"
                            title="Time Limit"
                            badge={{ type: 'fixed', text: 'FIXED' }}
                        />
                        <ButtonGroup
                            options={TIME_OPTIONS}
                            selected={settings.timeLimit}
                            onSelect={(value) => updateSetting('timeLimit', value)}
                            colorScheme="blue"
                        />
                    </div>

                    {/* Genres */}
                    <div style={{ marginBottom: '32px' }}>
                        <SectionHeader
                            icon="🎭"
                            title="Genres"
                            badge={{ type: 'fixed', text: 'FIXED' }}
                        />
                        <ErrorMessage error={errors.genres} />
                        <ButtonGroup
                            options={GENRES}
                            selected={settings.genres}
                            onSelect={handleGenreToggle}
                            colorScheme="green"
                        />
                    </div>

                    {/* Challenge Prompt */}
                    <div style={{ marginBottom: '32px' }}>
                        <SectionHeader
                            icon="📝"
                            title="Challenge Prompt"
                            badge={{ type: 'fixed', text: 'FIXED' }}
                        />

                        {/* <div style={{ marginBottom: '16px' }}>
                            <CheckboxField
                                checked={settings.isBlindPrompt}
                                onChange={(e) => updateSetting('isBlindPrompt', e.target.checked)}
                                label="Blind Challenge (prompt revealed after match starts)"
                            />
                        </div> */}

                        <select
                            value={settings.promptType}
                            onChange={(e) => updateSetting('promptType', e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '2px solid #e5e7eb',
                                borderRadius: '8px',
                                fontSize: '16px',
                                backgroundColor: 'white',
                                marginBottom: '12px'
                            }}
                        >
                            {PROMPT_TYPES.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>

                        {settings.promptType === 'Plot Twist Injection' && (
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
                                    📈 Plot Twist Details:
                                </label>
                                <ErrorMessage error={errors.plotTwistText} />
                                <textarea
                                    value={settings.plotTwistText}
                                    onChange={(e) => updateSetting('plotTwistText', e.target.value)}
                                    placeholder="Describe the plot twist that must be injected (e.g., 'the main character discovers they are a robot', 'the story was a dream all along')"
                                    style={{
                                        width: '100%',
                                        minHeight: '60px',
                                        padding: '12px',
                                        border: '2px solid #f59e0b',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        backgroundColor: '#fffbeb',
                                        resize: 'vertical',
                                        fontFamily: 'inherit'
                                    }}
                                />
                            </div>
                        )}

                        <ErrorMessage error={errors.promptText} />
                        <textarea
                            value={settings.promptText}
                            onChange={(e) => updateSetting('promptText', e.target.value)}
                            placeholder="Enter your challenge prompt (e.g., 'no dialogues, set in steampunk 1920s')"
                            style={{
                                width: '100%',
                                minHeight: '80px',
                                padding: '12px',
                                border: '2px solid #e5e7eb',
                                borderRadius: '8px',
                                fontSize: '16px',
                                resize: 'vertical',
                                fontFamily: 'inherit'
                            }}
                        />
                    </div>

                    {/* Word Limit */}
                    <div style={{ marginBottom: '32px' }}>
                        <SectionHeader
                            icon="📊"
                            title="Word Limit"
                            badge={{ type: 'optional', text: 'OPTIONAL' }}
                        />
                        <div style={{ marginBottom: '12px' }}>
                            <CheckboxField
                                checked={!!settings.wordCap}
                                onChange={(e) => updateSetting('wordCap', e.target.checked ? 500 : null)}
                                label="Set word limit"
                            />
                        </div>
                        {settings.wordCap && (
                            <ButtonGroup
                                options={WORD_CAPS}
                                selected={settings.wordCap}
                                onSelect={(value) => updateSetting('wordCap', value)}
                                colorScheme="purple"
                            />
                        )}
                    </div>

                    {/* Must Include */}
                    <div style={{ marginBottom: '32px' }}>
                        <SectionHeader
                            icon="🎯"
                            title="Must Include"
                            badge={{ type: 'optional', text: 'OPTIONAL' }}
                        />
                        <ErrorMessage error={errors.objectInclusion} />
                        <input
                            type="text"
                            value={settings.objectInclusion}
                            onChange={(e) => updateSetting('objectInclusion', e.target.value)}
                            placeholder="Enter a specific word, object, or phrase that must appear in the story"
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '2px solid #e5e7eb',
                                borderRadius: '8px',
                                fontSize: '16px'
                            }}
                        />
                    </div>

                    {/* Reverse Challenge */}
                    <div style={{ marginBottom: '32px' }}>
                        <SectionHeader
                            icon="🔄"
                            title="Reverse Challenge"
                            badge={{ type: 'optional', text: 'OPTIONAL' }}
                        />
                        <label style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            fontSize: '16px',
                            cursor: 'pointer',
                            padding: '12px',
                            border: '2px solid #e5e7eb',
                            borderRadius: '8px',
                            backgroundColor: settings.reverseChallenge ? '#fef3c7' : 'white'
                        }}>
                            <input
                                type="checkbox"
                                checked={settings.reverseChallenge}
                                onChange={(e) => updateSetting('reverseChallenge', e.target.checked)}
                                style={{ transform: 'scale(1.3)' }}
                            />
                            <div>
                                <strong>Enable Reverse Challenge</strong>
                                <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#6b7280' }}>
                                    Start with the ending and work backwards to the beginning
                                </p>
                            </div>
                        </label>
                    </div>

                    {/* Match Summary */}
                    <div style={{
                        backgroundColor: '#f8fafc',
                        border: '2px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '20px',
                        marginBottom: '24px'
                    }}>
                        <h4 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 'bold', color: '#1e293b' }}>
                            🎯 Match Summary
                        </h4>
                        <div style={{ display: 'grid', gap: '8px', fontSize: '14px' }}>
                            {summaryItems.map((item, index) => (
                                <div key={index}>
                                    <strong>{item.label}:</strong> {item.value}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                        <button
                            onClick={onCancel}
                            style={{
                                padding: '12px 24px',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                border: '2px solid #e5e7eb',
                                borderRadius: '8px',
                                backgroundColor: 'white',
                                color: '#6b7280',
                                cursor: 'pointer',
                                minWidth: '120px'
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => handleStartMatch()}
                            style={{
                                padding: '12px 24px',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                border: 'none',
                                borderRadius: '8px',
                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                color: 'white',
                                cursor: 'pointer',
                                minWidth: '120px',
                                boxShadow: '0 4px 6px rgba(16, 185, 129, 0.3)'
                            }}
                        >
                            🚀 Start Match
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}