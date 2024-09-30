const fetchLatestContent = async () => {
    try {
      // Fetch latest jobs from your own database
      const latestJobs = await jobCollection.find({}).sort({ createdAt: -1 }).limit(5).toArray();
      console.log(latestJobs)
  
      // Fetch latest news from News API
      const newsResponse = await axios.get(
        `https://newsapi.org/v2/top-headlines?country=us&category=technology&apiKey=${process.env.NEWS_API_KEY}`
      );
      const latestNews = newsResponse.data.articles.slice(0, 5); // Get top 5 news articles
  
      return { latestJobs, latestNews };
    } catch (error) {
      console.error("Error fetching latest content:", error.response?.data || error.message);
      return { latestJobs: [], latestNews: [] };
    }
  };
  
  // Function to send daily emails to all subscribers
const sendDailyEmails = async () => {
    try {
      const subscribers = await subscriberCollection.find({}).toArray();
      if (subscribers.length === 0) {
        console.log("No subscribers to send emails to.");
        return;
      }
  
      const { latestJobs, latestNews } = await fetchLatestContent();
  
      // Construct email content
      let emailContent = `
        <h1>Daily Jobs and News Update</h1>
        <h2>Latest Jobs</h2>
        <ul>
      `;
      latestJobs.forEach((job) => {
        emailContent += `
          <li>
            <strong>${job.jobTitle}</strong> at ${job.companyName} - <a href="${job.applyLink}" target="_blank">Apply Here</a>
            <br>Location: ${job.jobLocation}
            <br>Salary: ${job.minPrice} - ${job.maxPrice} (${job.salaryType})
            <br>Experience Level: ${job.experienceLevel}
            <br>Employment Type: ${job.employmentType}
            <br>Description: ${job.description}
            <br>Skills: ${job.skills.map(skill => skill.label).join(', ')}
            <br><img src="${job.companyLogo}" alt="${job.companyName} Logo" width="100">
          </li>
        `;
      });
      emailContent += `</ul>`;
  
      emailContent += `
        <h2>Latest News</h2>
        <ul>
      `;
      latestNews.forEach((article) => {
        emailContent += `
          <li>
            <a href="${article.url}" target="_blank">${article.title}</a>
            <br><img src="${article.urlToImage}" alt="${article.title}" width="100">
          </li>
        `;
      });
      emailContent += `</ul>`;
  
      // Send email to each subscriber
      for (const subscriber of subscribers) {
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: subscriber.email,
          subject: "Your Daily Jobs and News Update",
          html: emailContent,
        };
  
        try {
          await transporter.sendMail(mailOptions);
          console.log(`Email sent to ${subscriber.email}`);
        } catch (error) {
          console.error(`Error sending email to ${subscriber.email}:`, error);
          console.error("Detailed error info:", error.response ? error.response.data : error);
        }
      }
    } catch (error) {
      console.error("Error in sendDailyEmails:", error);
    }
  };
  
  cron.schedule("52 12 * * *", () => {
    console.log("Running daily email job at 12:42 PM");
    sendDailyEmails();
  });