import React, { useState } from "react";
import Badge from "./Badge"; // Adjust path if needed
import {
  User,
  Brain,
  Check,
  CreditCard,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Info,
} from "lucide-react";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";

const Card = ({ children }) => (
  <div className="card shadow-sm mb-4 rounded-3">{children}</div>
);

const CardHeader = ({ children }) => (
  <div className="card-header bg-light border-bottom">{children}</div>
);

const CardContent = ({ children }) => (
  <div className="card-body bg-white">{children}</div>
);

const CardTitle = ({ children }) => (
  <h5 className="card-title mb-1 d-flex align-items-center gap-2">
    {children}
  </h5>
);

const CardDescription = ({ children }) => (
  <p className="text-muted mb-0">{children}</p>
);

const Label = ({ htmlFor, children }) => (
  <label htmlFor={htmlFor} className="form-label fw-semibold">
    {children}
  </label>
);

const Input = ({ id, ...props }) => (
  <input id={id} className="form-control rounded-2" {...props} />
);

const Select = ({ id, children, onChange }) => (
  <select id={id} className="form-select rounded-2" onChange={onChange}>
    {children}
  </select>
);

const Button = ({
  children,
  variant = "primary",
  className = "",
  ...props
}) => {
  const btnClass =
    variant === "outline" ? "btn btn-outline-primary" : "btn btn-primary";
  return (
    <button className={`${btnClass} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Progress = ({ value }) => (
  <div className="progress" style={{ height: "20px" }}>
    <div
      className="progress-bar progress-bar-striped progress-bar-animated bg-success"
      role="progressbar"
      style={{ width: `${value}%` }}
      aria-valuenow={value}
      aria-valuemin="0"
      aria-valuemax="100"
    >
      {value}%
    </div>
  </div>
);

const ApplicationForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    income: "",
    employment: "",
    loanAmount: "",
    loanPurpose: "",
    location: "",
    phoneUsage: "",
    utilityPayments: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [creditScore, setCreditScore] = useState(0);
  const [riskLevel, setRiskLevel] = useState("Low");
  const [approvalProbability, setApprovalProbability] = useState(0);

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setCreditScore(750);
      setRiskLevel("Low");
      setApprovalProbability(85);
      setShowResults(true);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="container py-4">
      {/* Application Form */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Check size={25} color="#2563eb" /> Credit Application
          </CardTitle>
          <CardDescription>
            Enter applicant information for AI-powered credit assessment.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="mb-4">
            <div className="row g-3">
              <div className="col-md-6">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                  placeholder="John"
                  required
                />
              </div>
              <div className="col-md-6">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                  placeholder="Doe"
                  required
                />
              </div>
              <div className="col-md-6">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                  placeholder="30"
                  required
                />
              </div>
              <div className="col-md-6">
                <Label htmlFor="income">Monthly Income (CFA)</Label>
                <Input
                  id="income"
                  type="number"
                  value={formData.income}
                  onChange={(e) => handleInputChange("income", e.target.value)}
                  placeholder="500000"
                  required
                />
              </div>
              <div className="col-md-6">
                <Label htmlFor="employment">Employment Status</Label>
                <Select
                  id="employment"
                  onChange={(e) =>
                    handleInputChange("employment", e.target.value)
                  }
                >
                  <option value="">Select status</option>
                  <option value="employed">Employed</option>
                  <option value="self-employed">Self-Employed</option>
                  <option value="unemployed">Unemployed</option>
                  <option value="student">Student</option>
                </Select>
              </div>
              <div className="col-md-6">
                <Label htmlFor="loanAmount">Loan Amount (CFA)</Label>
                <Input
                  id="loanAmount"
                  type="number"
                  value={formData.loanAmount}
                  onChange={(e) =>
                    handleInputChange("loanAmount", e.target.value)
                  }
                  placeholder="2000000"
                  required
                />
              </div>
              <div className="col-md-6">
                <Label htmlFor="loanPurpose">Loan Purpose</Label>
                <Select
                  id="loanPurpose"
                  onChange={(e) =>
                    handleInputChange("loanPurpose", e.target.value)
                  }
                >
                  <option value="">Select purpose</option>
                  <option value="business">Business</option>
                  <option value="education">Education</option>
                  <option value="home">Home Purchase</option>
                  <option value="personal">Personal</option>
                </Select>
              </div>
              <div className="col-md-6">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  placeholder="Douala, Cameroon"
                  required
                />
              </div>
              <div className="col-md-6">
                <Label htmlFor="phoneUsage">Mobile Usage Pattern</Label>
                <Select
                  id="phoneUsage"
                  onChange={(e) =>
                    handleInputChange("phoneUsage", e.target.value)
                  }
                >
                  <option value="">Select usage</option>
                  <option value="elevated">Elevated &gt; 8-12 hrs/day</option>
                  <option value="heavy">Heavy &gt;5 hrs/day</option>
                  <option value="moderate">Moderate 2-5 hrs/day</option>
                  <option value="light">Light &lt;2 hrs/day</option>
                </Select>
              </div>
              <div className="col-md-6">
                <Label htmlFor="utilityPayments">Utility Payment History</Label>
                <Select
                  id="utilityPayments"
                  onChange={(e) =>
                    handleInputChange("utilityPayments", e.target.value)
                  }
                >
                  <option value="">Select history</option>
                  <option value="excellent">Always on time</option>
                  <option value="good">Mostly on time</option>
                  <option value="fair">Sometimes late</option>
                  <option value="poor">Often late</option>
                </Select>
              </div>
            </div>

            <div className="mt-4">
              <Button type="submit" disabled={isLoading} className="w-100">
                {isLoading ? "Processing with AI..." : "Analyze Credit Risk"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Loading and Results */}
      {isLoading && (
        <Card>
          <CardHeader>
            <CardTitle>
              <Brain className="text-info" /> AI Processing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-3">
              <small>Analyzing credit data...</small>
              <Progress value={100} />
            </div>
            <div className="mb-3">
              <small>Processing alternative data...</small>
              <Progress value={75} />
            </div>
            <div className="mb-3">
              <small>Running machine learning models...</small>
              <Progress value={45} />
            </div>
            <div>
              <small>Bias and compliance checks...</small>
              <Progress value={20} />
            </div>
          </CardContent>
        </Card>
      )}

      {showResults && (
        <>
          {/* Render your results cards here (Credit Score, Risk Factors, etc.) exactly as in your code above */}
        </>
      )}
    </div>
  );
};

export default ApplicationForm;
