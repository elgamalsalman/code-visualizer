export default {
	port: 3001,
	root_dir_path: process.cwd(),
	auth: {
		hash_length: 64,
		secret_length: 64,
		email_verification_lifetime: 24 * 60 * 60 * 1000, // one day
		password_reset_lifetime: 15 * 60 * 1000, // 15 minutes
		access_token_lifetime: 5 * 60 * 1000, // 5 minutes
		refresh_token_lifetime: 3 * 24 * 60 * 60 * 1000, // 3 days
		saml_id: "https://www.algoview.com/api/v1/auth/saml/metadata",
		methods: {
			nyu: {
				entry_point:
					"https://shibboleth.nyu.edu/idp/profile/SAML2/Redirect/SSO",
				certificate: `-----BEGIN CERTIFICATE-----
MIIGzTCCBTWgAwIBAgIRAPQaF36Le4lpbFc/EWytNaQwDQYJKoZIhvcNAQEMBQAw RDELMAkGA1UEBhMCVVMxEjAQBgNVBAoTCUludGVybmV0MjEhMB8GA1UEAxMYSW5D b21tb24gUlNBIFNlcnZlciBDQSAyMB4XDTI0MDUyODAwMDAwMFoXDTI1MDUyODIz NTk1OVowWzELMAkGA1UEBhMCVVMxETAPBgNVBAgTCE5ldyBZb3JrMRwwGgYDVQQK ExNOZXcgWW9yayBVbml2ZXJzaXR5MRswGQYDVQQDExJzaGliYm9sZXRoLm55dS5l ZHUwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDfb4botPJTcMPCLDen zHqWAOJFenUGEAL33ROzA687b73Fg72Fnlh2Pp7HNhbB3+cQjsQODitjFdUVQgX8 EAP3xMZAGKU2M/0ZGfnGokj5oiU080ii6zOzEDUCkulR5CW6p+mgdoCYXs3b9riw m1X5pqi/4ZbCKP+K6TiSBOGWxtCsBp7mWFdJlWUT6a3VRdoYmUUQEOJfrTyT8CW0 dk0DGToWe2j3taxGT89E3VA6w5GktQK5sxllEAVQ23fiMdouDAtr4gDNvOSwtYUu Dwh/Ppl/lAMwjU+dv08pNuJR9drFjYM0jKoiPsG9AdEwkFSGQb0IB1wt8+wAeTCX IKMrAgMBAAGjggMhMIIDHTAfBgNVHSMEGDAWgBTvTACSpvt2Ll6V4slfhxsZ1U3i 2TAdBgNVHQ4EFgQUleQurEqBxsOHqhL90hCiWMKIvx0wDgYDVR0PAQH/BAQDAgWg MAwGA1UdEwEB/wQCMAAwHQYDVR0lBBYwFAYIKwYBBQUHAwEGCCsGAQUFBwMCMEkG A1UdIARCMEAwNAYLKwYBBAGyMQECAmcwJTAjBggrBgEFBQcCARYXaHR0cHM6Ly9z ZWN0aWdvLmNvbS9DUFMwCAYGZ4EMAQICMEAGA1UdHwQ5MDcwNaAzoDGGL2h0dHA6 Ly9jcmwuc2VjdGlnby5jb20vSW5Db21tb25SU0FTZXJ2ZXJDQTIuY3JsMHAGCCsG AQUFBwEBBGQwYjA7BggrBgEFBQcwAoYvaHR0cDovL2NydC5zZWN0aWdvLmNvbS9J bkNvbW1vblJTQVNlcnZlckNBMi5jcnQwIwYIKwYBBQUHMAGGF2h0dHA6Ly9vY3Nw LnNlY3RpZ28uY29tMB0GA1UdEQQWMBSCEnNoaWJib2xldGgubnl1LmVkdTCCAX4G CisGAQQB1nkCBAIEggFuBIIBagFoAHYAzxFW7tUufK/zh1vZaS6b6RpxZ0qwF+ys AdJbd87MOwgAAAGPv2kpQgAABAMARzBFAiEAzvxir8MFsWVDlWfmTq4uOuRBq8d3 Dak2HX5AwAhATUQCIH0V+tNJNhjJIBF5S2+eeySRPQZ1F3XQvReIQrrOqul4AHcA ouMK5EXvva2bfjjtR2d3U9eCW4SU1yteGyzEuVCkR+cAAAGPv2kpBQAABAMASDBG AiEAg7ww1IGFCOMLM2e+Q3BayKa+t6wdoWrhOy5D3LJH7k0CIQDiSbOsfQUZjHI5 1f3D3TLRyqpEBSm44ztIYJXN2IcqZgB1AE51oydcmhDDOFts1N8/Uusd8OCOG41p wLH6ZLFimjnfAAABj79pKQQAAAQDAEYwRAIgYUXMap5HGQQaW60ux33/7Wo/DzPB Gn9IUp6u78sdQGMCIDWszzMaKK3s3u3a+FintL5Q8ljWAOlEVXZ7qO6zBWkSMA0G CSqGSIb3DQEBDAUAA4IBgQAZ0Cx3KTL5P5XNojLanfKhC+3p2YYqo7yivleCMHLy 5ARnP4ZYNzsOYhIG9rEzj7uU7GWX7haxig65aL8yjeDGGDOw/GrT1n4Ko7YK36t+ FlZB+PMW9018teFi1VRtDVr1FpISTyQvq1KcaRVMBtA8r5hlOERe9CH9jotIjaql k6sWt9uQBGCLtRaqvZg/shkqSVdWx9iWonIBgEO1r8f7PM8UPjnMOnQWJX/Oepwa /9XIWvFh9ej5K08u1Pl+depxPk9SlV8T/Xwg2TY24fxmqkuz0kqVlkTWKERGt3ym 6WX8YpvHKZqupAsELKg48jbfLy4+RYdrNvsam8OtSRn/t8fCG5s3LsPciXDLfPtI ZBAfe/qodyQ2FaMS2Eo3DiY91onETaAAndn1332ByFAJttLFPXqYA/dGSQWnjFUF 0gbd/KhJ6nwk6SmMh8EXzozdAmZDG6HnKseXMVDvCFklLsXg3rkWQ6MwuPjLVSyW HKwMSzofgSB4zINht8RRUIQ=
-----END CERTIFICATE-----`,
			},
		},
	},
	http_codes: {
		success: 200,
		failed: 500,
		unauthorized: 401,
		forbidden: 403,
	},
	cookies: {
		options: {
			httpOnly: true,
			sameSite: "None",
			secure: true,
		},
		access_token: { name: "__algoview_access_token__" },
		refresh_token: { name: "__algoview_refresh_token__" },
	},
	users: {
		files: {
			root_dir_path: "_users",
			executable_file_name: ".exe",
			program_input_file_name: ".in",
			program_output_file_name: ".out",
			program_error_file_name: ".err",
			shared: {
				template: {
					path: "scripts/template",
				},
				makefile: {
					name: "makefile",
				},
				code_header: {
					path: "scripts/code_header.cpp",
				},
				named_pipe_maintainer: {
					path: "scripts/named_pipe_maintainer.sh",
				},
			},
		},
	},
	file_manager: {
		eventTypes: ["create", "write", "delete"],
		entityTypes: ["file", "dir"],
		user_statuses: {
			free_status: "__free__",
			pending_statuses: {
				reading: "__reading__",
				writing: "__writing__",
				running: "__running__",
			},
			pending_check_period: 1000,
		},
	},
	code_analyser: {
		events: {
			input: "input",
			output: "output",
			error: "error",
		},
		events_templates: {
			input: {
				type: "input",
				content: "the inputted text",
			},
		},
	},
};
